/** 公式HP のプレイ履歴を登録 */

import { z } from "zod";
import { produce } from "immer";
import { trackTitleSchema } from "../../../domain/track/track";
import {
  difficultySchema,
  difficultyToStr,
} from "../../../domain/track/difficulty";
import {
  achievementSchema,
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

// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST(request: Request): Promise<Response> {
  const json = await request.text();
  const jsonObj = JSON.parse(json);
  const histories = playHistoriesSchema.parse(jsonObj);

  // 全履歴を登録
  const results = await Promise.all(
    histories.map((history, index) =>
      prismaClient.$transaction(async (tx) =>
        saveAchievement(history, index, tx),
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
  tx: PrismaTransaction,
): Promise<LoadOhpHistoryResult> {
  const { title, difficulty, achievement: submitAchievement } = history;

  const trackRepository = new TrackRepository(tx);
  const userTrackRepository = new UserTrackRepository(tx);

  // DB から該当する譜面を検索
  const track = await trackRepository.getByTitle(title);
  if (track === undefined) {
    return makeError(history, index, `曲データが見つかりません: ${title}`);
  }
  const score = track.scores[difficulty];
  if (score === undefined) {
    return makeError(
      history,
      index,
      `難易度 "${difficultyToStr(difficulty)}" の譜面がありません: ${title}`,
    );
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
    title,
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
