import { HOT, OTHER, SkillType } from "../../domain/track/skill_type";
import { PrismaTransaction } from "../prisma_client";
import { SkillRangeScore, SkillScoreList } from "./skill_range_score";
import { difficultySchema } from "../../domain/track/difficulty";

/**
 * スキル対象曲リストを読み込む
 *
 * @param take スキル区分毎の取得曲数
 */
export async function loadSkillRangeScores(
  prismaTransaction: PrismaTransaction,
  take: number,
): Promise<SkillScoreList> {
  return {
    [HOT]: await loadBySkillType(prismaTransaction, HOT, take),
    [OTHER]: await loadBySkillType(prismaTransaction, OTHER, take),
  };
}

/** スキル区分毎の読み込み */
async function loadBySkillType(
  prismaTransaction: PrismaTransaction,
  skillType: SkillType,
  take: number,
): Promise<SkillRangeScore[]> {
  let readIndex = 0;
  let scores: Array<SkillRangeScore> = [];

  // 指定された曲数を読み込むまで繰り返す
  while (scores.length < take) {
    // 今回読み込む曲数
    const iterateTake = take - scores.length;

    const iterateScores = await readDb(
      prismaTransaction,
      skillType,
      iterateTake,
      readIndex,
    );
    readIndex += iterateTake;

    scores = filterDupulicatedTrack([...scores, ...iterateScores]);

    // もう DB にデータが残ってなければ終了
    if (iterateScores.length < iterateTake) {
      break;
    }
  }

  return scores;
}

async function readDb(
  prismaTransaction: PrismaTransaction,
  skillType: SkillType,
  take: number,
  skip: number,
): Promise<SkillRangeScore[]> {
  return (
    await prismaTransaction.userScore.findMany({
      select: {
        trackId: true,
        difficulty: true,
        skillPoint: true,
        achievement: true,
        score: {
          select: { lv: true },
        },
        userTrack: { select: { track: { select: { title: true } } } },
      },
      where: {
        skillPoint: { gt: 0 },
        userTrack: { track: { skillType, deleted: false } },
      },
      orderBy: [
        { skillPoint: "desc" },
        { difficulty: "desc" },
        { trackId: "asc" },
      ],
      take,
      skip,
    })
  ).map(
    ({ trackId, difficulty, skillPoint, achievement, score, userTrack }) => ({
      trackId,
      difficulty: difficultySchema.parse(difficulty),
      skillPoint,
      achievement,
      lv: score.lv,
      title: userTrack.track.title,
    }),
  );
}

/** リストから曲が重複するものを削除 */
function filterDupulicatedTrack(
  scores: ReadonlyArray<SkillRangeScore>,
): SkillRangeScore[] {
  const filtered: SkillRangeScore[] = [];

  for (const score of scores) {
    if (filtered.every((t) => t.trackId !== score.trackId)) {
      filtered.push(score);
    }
  }

  return filtered;
}
