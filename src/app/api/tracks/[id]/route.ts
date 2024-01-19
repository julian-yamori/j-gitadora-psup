import { getFormCheckbox, getFormString } from "@/app/_util/form_convert";
import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track_repository";
import UserTrackRepository from "@/db/user_track_repository";
import { Difficulty } from "@/domain/track/difficulty";
import { Track } from "@/domain/track/track";
import {
  UserScore,
  UserTrackScores,
  trackSkillPoint,
  initialUserTrack,
  validateTrackLike,
} from "@/domain/track/user_track";
import formKeyByScore from "../form_key";

/** 曲詳細画面からの情報の更新 */
// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST(
  request: Request,
  context: { params: { id: string } },
): Promise<Response> {
  const form = await request.formData();

  const trackId = context.params.id;

  await prismaClient.$transaction(async (tx) => {
    const trackRepository = new TrackRepository(tx);
    const userTrackRepository = new UserTrackRepository(tx);

    const track = await trackRepository.get(trackId);
    if (track === undefined) {
      throw Error(`track not found: ${trackId}`);
    }

    const oldUserData =
      (await userTrackRepository.get(track.id)) ?? initialUserTrack(track);

    const newUserData = {
      ...oldUserData,
      like: likeFromForm(form),
      isOpen: getFormCheckbox(form, "is_open"),
      memo: getFormString(form, "memo"),
      scores: buildNewScores(form, oldUserData.scores, track),
    };

    await userTrackRepository.save(newUserData);
  });

  return new Response();
}

function likeFromForm(form: FormData): number | undefined {
  // 0 と null は、undefined扱いの有効値とする

  function throwErr() {
    throw Error('form value "like" is invalid');
  }

  const value = form.get("like");
  if (value === null) return undefined;

  const num = Number(value);
  if (num === 0) return undefined;
  if (!validateTrackLike(num)) throwErr();
  return num;
}

/**
 * 登録すべき全ての譜面情報を生成
 * @param form リクエストのFormData
 * @param oldScores 登録前の譜面情報
 * @param track 生成元の曲情報
 * @returns 登録する全譜面の情報
 */
function buildNewScores(
  form: FormData,
  oldScores: UserTrackScores,
  track: Track,
): UserTrackScores {
  return Object.fromEntries(
    [...Object.values(oldScores)].map((old): [Difficulty, UserScore] => [
      old.difficulty,
      buildNewScore(form, old, track),
    ]),
  );
}

/**
 * 登録すべき譜面情報を一つ生成
 * @param form リクエストのFormData
 * @param old 登録前の譜面情報
 * @param track 生成元の曲情報
 * @returns 登録する譜面一つの情報
 */
function buildNewScore(
  form: FormData,
  old: UserScore,
  track: Track,
): UserScore {
  const score = track.scores[old.difficulty];
  if (score === undefined) {
    throw Error(
      `difficulty "${old.difficulty}" not found in track "${track.id}"`,
    );
  }

  const failed = getFormCheckbox(
    form,
    formKeyByScore(old.difficulty, "failed"),
  );
  const achievement = achievementFromForm(form, old.difficulty, failed);

  return {
    ...old,
    achievement,
    skillPoint: trackSkillPoint(score.lv, achievement),
    failed,
    movieURL: getFormString(form, formKeyByScore(old.difficulty, "movie_url")),
  };
}

function achievementFromForm(
  form: FormData,
  difficulty: Difficulty,
  failed: boolean,
): number {
  const formKey = formKeyByScore(difficulty, "achievement");

  const strValue = form.get(formKey);

  // failedの場合、disabledで取得できないので 0 扱い。
  // UI上では、 0 でなければfailedにできないはず。
  if (strValue === null && failed) {
    return 0;
  }

  if (typeof strValue !== "string") {
    throw Error(`form value "${formKey}" is not string`);
  }

  if (strValue === "") return 0;

  const numValue = Number(strValue);
  if (Number.isNaN(numValue)) {
    throw Error(`form value "${formKey}" is not number`);
  }

  // % から 0〜1 に変換
  return numValue / 100;
}
