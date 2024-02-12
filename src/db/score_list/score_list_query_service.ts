import { ScoreQuery } from "@/domain/score_query/score_query";
import { skillTypeSchema } from "@/domain/track/skill_type";
import { difficultySchema } from "@/domain/track/difficulty";
import { ScoreOrder } from "@/domain/score_query/score_order";
import neverError from "@/utils/never_error";
import { PrismaTransaction } from "../prisma_client";
import { ScoreListDto } from "./score_list_dto";
import scoreFilterToWhere from "./score_filter_to_where";

export default async function queryScoreList(
  prismaTransaction: PrismaTransaction,
  scoreQuery: ScoreQuery,
): Promise<ScoreListDto> {
  const where = scoreFilterToWhere(scoreQuery.filter);

  // filter に一致するレコード数の取得
  const count = await prismaTransaction.score.count({ where });

  // レコード自体の検索
  const { skip, take } = scoreQuery.paging;
  const rows = await prismaTransaction.score.findMany({
    include: {
      track: {
        select: { title: true, skillType: true, long: true, userTrack: true },
      },
      userScore: true,
    },
    where,
    orderBy: orderDomainToPrisma(scoreQuery.order),
    skip,
    take,
  });

  return {
    rows: rows.map((f) => ({
      trackId: f.trackId,
      title: f.track.title,
      skillType: skillTypeSchema.parse(f.track.skillType),
      long: f.track.long,
      difficulty: difficultySchema.parse(f.difficulty),
      lv: f.lv,
      like: f.track.userTrack?.like ?? undefined,
      achievement: f.userScore?.achievement,
      skillPoint: f.userScore?.skillPoint,
    })),
    count,
  };
}

// ScoreOrder を Prisma の orderBy に変換
function orderDomainToPrisma(order: ScoreOrder) {
  return order.map(({ target, direction }) => {
    switch (target) {
      // Track
      case "title":
      case "skillType":
      case "long":
        return { track: { [target]: direction } };

      // Score
      case "difficulty":
      case "lv":
        return { [target]: direction };

      // UserTrack
      case "like":
        return { track: { userTrack: { [target]: direction } } };

      // userScore
      case "achievement":
      case "skillPoint":
        return { userScore: { [target]: direction } };

      default:
        throw neverError(target);
    }
  });
}
