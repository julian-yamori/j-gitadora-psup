import { Difficulty, difficultySchema } from "../../domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";
import neverError from "../../utils/never_error";

/** 公式 HP からの履歴読み込みの、曲毎の読み込み結果 */
export type LoadOhpHistoryResult = LoadOhpHistorySuccess | LoadOhpHistoryError;

/** 公式 HP からの履歴読み込みの、曲毎の成功時のデータ */
export type LoadOhpHistorySuccess = Readonly<{
  type: "success";
  index: number;

  trackId: string;
  title: string;
  difficulty: Difficulty;

  /** 登録しようとした達成率 */
  submitAchievement: number;
  /** 元々登録されていた達成率 */
  oldAchievement: number | undefined;
  /** 登録後の達成率 */
  newAchievement: number;
}>;

/** 公式 HP からの履歴読み込みの、曲毎の失敗時のデータ */
export type LoadOhpHistoryError = Readonly<{
  type: "error";
  index: number;

  message: string;
}>;

/** 公式 HP からの履歴読み込みの結果を DB から取得 */
export async function loadResults(
  prismaTransaction: PrismaTransaction,
): Promise<LoadOhpHistoryResult[]> {
  return (
    await prismaTransaction.loadOhpHistoryResult.findMany({
      include: { track: { select: { title: true } } },
    })
  ).map(
    ({
      index,
      trackId,
      track,
      difficulty,
      submitAchievement,
      oldAchievement,
      newAchievement,
      error,
    }) => {
      if (error !== null) {
        return { type: "error", index, message: error };
      }

      if (
        trackId === null ||
        track === null ||
        difficulty === null ||
        submitAchievement === null ||
        oldAchievement === null ||
        newAchievement === null
      ) {
        return loadResultRecordError(index);
      }

      return {
        type: "success",
        index,
        trackId,
        title: track.title,
        difficulty: difficultySchema.parse(difficulty),
        submitAchievement,
        oldAchievement,
        newAchievement,
      };
    },
  );
}

function loadResultRecordError(index: number): LoadOhpHistoryError {
  return {
    type: "error",
    index,
    message: "読み込み結果の取得に失敗しました。",
  };
}

/** 公式 HP からの履歴読み込みの結果を DB に保存 */
export async function saveResults(
  prismaTransaction: PrismaTransaction,
  results: ReadonlyArray<LoadOhpHistoryResult>,
): Promise<void> {
  await prismaTransaction.loadOhpHistoryResult.deleteMany();

  const records = results.map((result) => {
    const { type } = result;
    switch (type) {
      case "success": {
        const {
          index,
          trackId,
          difficulty,
          submitAchievement,
          oldAchievement,
          newAchievement,
        } = result;

        return {
          index,
          trackId,
          difficulty,
          submitAchievement,
          oldAchievement,
          newAchievement,
        };
      }

      case "error":
        return {
          index: result.index,
          error: result.message,
        };

      default:
        throw neverError(type);
    }
  });

  await prismaTransaction.loadOhpHistoryResult.createMany({ data: records });
}

export function newResultId(): string {
  return crypto.randomUUID();
}
