import { getFormCheckbox, getFormString } from "@/app/_util/form_convert";
import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track_repository";
import TrackUserRepository from "@/db/track_user_repository";
import { Difficulty } from "@/domain/track/difficulty";
import { Track } from "@/domain/track/track";
import {
  TrackUserDataByDifficulty,
  TrackUserDifficulties,
  trackSkillPoint,
  initialTrackUserData,
  validateTrackLike,
} from "@/domain/track/track_user_data";
import formKeyByDifficulty from "../form_key";

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
    const trackUserRepository = new TrackUserRepository(tx);

    const track = await trackRepository.get(trackId);
    if (track === undefined) {
      throw Error(`track not found: ${trackId}`);
    }

    const oldUserData =
      (await trackUserRepository.get(track.id)) ?? initialTrackUserData(track);

    const newUserData = {
      ...oldUserData,
      like: likeFromForm(form),
      isOpen: getFormCheckbox(form, "is_open"),
      memo: getFormString(form, "memo"),
      difficulties: buildNewDifficulties(form, oldUserData.difficulties, track),
    };

    await trackUserRepository.save(newUserData);
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
 * 登録すべき難易度別情報を生成
 * @param form リクエストのFormData
 * @param oldDifficulties 登録前の難易度毎情報
 * @param track 生成元の曲情報
 * @returns 難易度毎の登録する情報
 */
function buildNewDifficulties(
  form: FormData,
  oldDifficulties: TrackUserDifficulties,
  track: Track,
): TrackUserDifficulties {
  return Object.fromEntries(
    [...Object.values(oldDifficulties)].map(
      (old): [Difficulty, TrackUserDataByDifficulty] => [
        old.difficulty,
        buildNewDifficulty(form, old, track),
      ],
    ),
  );
}

/**
 * 登録すべき難易度別情報を一つ生成
 * @param form リクエストのFormData
 * @param oldDifficulties 登録前の難易度毎情報
 * @param track 生成元の曲情報
 * @returns 難易度一つについての登録する情報
 */
function buildNewDifficulty(
  form: FormData,
  old: TrackUserDataByDifficulty,
  track: Track,
): TrackUserDataByDifficulty {
  const trackDifficulty = track.difficulties[old.difficulty];
  if (trackDifficulty === undefined) {
    throw Error(
      `difficulty "${old.difficulty}" not found in track "${track.id}"`,
    );
  }

  const failed = getFormCheckbox(
    form,
    formKeyByDifficulty(old.difficulty, "failed"),
  );
  const achievement = achievementFromForm(form, old.difficulty, failed);

  return {
    ...old,
    achievement,
    skillPoint: trackSkillPoint(trackDifficulty.lv, achievement),
    failed,
    movieURL: getFormString(
      form,
      formKeyByDifficulty(old.difficulty, "movie_url"),
    ),
  };
}

function achievementFromForm(
  form: FormData,
  difficulty: Difficulty,
  failed: boolean,
): number {
  const formKey = formKeyByDifficulty(difficulty, "achievement");

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
