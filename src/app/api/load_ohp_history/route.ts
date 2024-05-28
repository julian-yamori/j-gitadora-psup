/** 公式HP のプレイ履歴を登録 */

import { z } from "zod";
import { produce } from "immer";
import { achievementSchema } from "../../../domain/track/achievement";
import { trackTitleSchema } from "../../../domain/track/track";
import {
  difficultySchema,
  difficultyToStr,
} from "../../../domain/track/difficulty";
import {
  initialUserScore,
  initialUserTrack,
  trackSkillPoint,
} from "../../../domain/track/user_track";
import prismaClient, { PrismaTransaction } from "../../../db/prisma_client";
import {
  LoadOhpHistoryResult,
  LoadOhpHistoryError,
  saveResults,
  LoadOhpHistorySuccess,
} from "../../../db/load_ohp_history/load_result";
import TrackRepository from "../../../db/track/track_repository";
import UserTrackRepository from "../../../db/track/user_track_repository";
import { TitleMapping, loadTitleMapping } from "./title_mapping";

export async function POST(request: Request): Promise<Response> {
  const json = await request.text();
  const jsonObj: unknown = JSON.parse(json);
  const histories = playHistoriesSchema.parse(jsonObj);

  const titleMapping = await loadTitleMapping();

  // 全履歴を登録
  const results = await Promise.all(
    histories.map((history, index) =>
      prismaClient.$transaction(async (tx) =>
        saveAchievement(history, index, titleMapping, tx),
      ),
    ),
  );

  // 登録結果を保存
  await prismaClient.$transaction((tx) => saveResults(tx, results));

  return new Response();
}

const playHistoriesSchema = z.array(
  z.object({
    title: trackTitleSchema,
    difficulty: difficultySchema,
    achievement: achievementSchema,
  }),
);

/** プレイ履歴から達成率を保存 */
async function saveAchievement(
  history: PlayHistory,
  index: number,
  titleMapping: TitleMapping,
  tx: PrismaTransaction,
): Promise<LoadOhpHistoryResult> {
  const {
    title: ohpTitle,
    difficulty,
    achievement: submitAchievement,
  } = history;

  const trackRepository = new TrackRepository(tx);
  const userTrackRepository = new UserTrackRepository(tx);

  const dbTitle = titleMapping[ohpTitle] ?? ohpTitle;

  // DB から該当する譜面を検索
  const track = await trackRepository.getByTitle(dbTitle);
  if (track === undefined) {
    return makeError(history, index, `曲データが見つかりません`);
  }
  const score = track.scores[difficulty];
  if (score === undefined) {
    return makeError(history, index, `譜面データが見つかりません`);
  }

  const trackId = track.id;

  // ユーザーの譜面情報を取得、もしくは新規作成
  const userTrack =
    (await userTrackRepository.get(trackId)) ?? initialUserTrack(track);
  const userScore = userTrack.scores[difficulty] ?? initialUserScore(score);

  const oldAchievement = userScore.achievement;

  const buildSuccess = (newAchievement: number): LoadOhpHistorySuccess => ({
    type: "success",
    index,
    title: dbTitle,
    difficulty,
    trackId,
    oldAchievement,
    submitAchievement,
    newAchievement,
  });

  // 元々の記録より高ければ更新
  if (oldAchievement < submitAchievement) {
    const newUserScore = produce(userScore, (draft) => {
      draft.achievement = submitAchievement;
      draft.failed = false;
      draft.skillPoint = trackSkillPoint(score.lv, submitAchievement);
    });
    const newUserTrack = produce(userTrack, (draft) => {
      draft.scores[difficulty] = newUserScore;
    });

    await userTrackRepository.save(newUserTrack);

    return buildSuccess(submitAchievement);
  }
  // 元々の記録以下ならそのまま
  else {
    return buildSuccess(oldAchievement);
  }
}

function makeError(
  history: PlayHistory,
  index: number,
  message: string,
): LoadOhpHistoryError {
  const { title, difficulty } = history;

  return {
    type: "error",
    index,
    message: `${message} : "${title}" / ${difficultyToStr(difficulty)}`,
  };
}
