import { ScoreFilter } from "@/domain/score_query/score_filter";
import { skillTypeSchema } from "@/domain/track/skill_type";
import { difficultySchema } from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";
import { ScoreListDto } from "./score_list_dto";
import scoreFilterToWhere from "./score_filter_to_where";

export default async function queryScoreList(
  prismaTransaction: PrismaTransaction,
  scoreFilter: ScoreFilter,
): Promise<ScoreListDto[]> {
  const found = await prismaTransaction.score.findMany({
    include: {
      track: {
        select: { title: true, skillType: true, long: true, userTrack: true },
      },
      userScore: true,
    },
    where: scoreFilterToWhere(scoreFilter),
  });

  return found.map((f) => ({
    trackId: f.trackId,
    title: f.track.title,
    skillType: skillTypeSchema.parse(f.track.skillType),
    long: f.track.long,
    difficulty: difficultySchema.parse(f.difficulty),
    lv: f.lv,
    like: f.track.userTrack?.like ?? undefined,
    achievement: f.userScore?.achievement,
    skillPoint: f.userScore?.skillPoint,
  }));
}
