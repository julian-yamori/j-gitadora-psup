/** 公式HP のプレイ履歴を登録 */

import { z } from "zod";
import { trackTitleSchema } from "../../../domain/track/track";
import {
  difficultySchema,
  difficultyToStr,
} from "../../../domain/track/difficulty";
import { achievementSchema } from "../../../domain/track/user_track";
import { PlayHistory } from "../../../load_ohp_history/play_history";
import prismaClient, { PrismaTransaction } from "../../../db/prisma_client";
import {
  LoadOhpHistoryResult,
  LoadOhpHistoryError,
  saveResults,
} from "../../../db/load_ohp_history/load_result";
import updateSkillPoint from "../../../db/track/update_skill_point";

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

  // DB から該当する譜面を検索
  const dbScores = await tx.score.findMany({
    where: {
      track: {
        deleted: false,
        title,
      },
      difficulty,
    },
    select: {
      trackId: true,
      userScore: { select: { achievement: true } },
    },
  });
  if (dbScores.length === 0) {
    return makeError(history, index, "譜面が見つかりませんでした");
  }
  if (dbScores.length > 1) {
    return makeError(
      history,
      index,
      `譜面の検索結果が ${dbScores.length} 件あります`,
    );
  }

  const dbScore = dbScores[0];
  const { trackId } = dbScore;
  const oldAchievement = dbScore.userScore?.achievement;

  // 元々の記録より高ければ登録
  if (oldAchievement === undefined || oldAchievement < submitAchievement) {
    await tx.userScore.update({
      data: {
        achievement: submitAchievement,

        // クリア済みのはずなので failed は下ろす
        failed: false,
      },
      where: { trackId_difficulty: { trackId, difficulty } },
    });

    await updateSkillPoint(tx, trackId);

    return {
      type: "success",
      index,
      title,
      difficulty,
      trackId,
      oldAchievement,
      submitAchievement,
      newAchievement: submitAchievement,
    };
  }
  // 元々の記録以下ならそのまま
  else {
    return {
      type: "success",
      index,
      title,
      difficulty,
      trackId,
      oldAchievement,
      submitAchievement,
      newAchievement: oldAchievement,
    };
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
