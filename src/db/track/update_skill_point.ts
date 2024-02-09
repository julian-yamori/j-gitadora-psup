import { trackSkillPoint } from "@/domain/track/user_track";
import { PrismaTransaction } from "../prisma_client";

/**
 * 曲のスキルポイントを更新
 */
export default async function updateSkillPoint(
  tx: PrismaTransaction,
  trackId: string,
): Promise<void> {
  const records = await tx.userScore.findMany({
    where: { trackId },
    select: {
      difficulty: true,
      achievement: true,
      score: { select: { lv: true } },
    },
  });

  const promises = records.map((record) =>
    tx.userScore.update({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- Prisma では _ で指定する必要がある
        trackId_difficulty: { trackId, difficulty: record.difficulty },
      },
      data: {
        skillPoint: trackSkillPoint(record.score.lv, record.achievement),
      },
    }),
  );

  await Promise.all(promises);
}
