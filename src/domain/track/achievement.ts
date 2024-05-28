import { z } from "zod";
import neverError from "../../utils/never_error";

// 達成率 (0〜1のfloat)
export const achievementSchema = z.number().nonnegative().max(1);

export const ACHIEVEMENT_RANK_SS = 1;
export const ACHIEVEMENT_RANK_S = 2;
export const ACHIEVEMENT_RANK_A = 3;
export const ACHIEVEMENT_RANK_B = 4;
export const ACHIEVEMENT_RANK_C = 5;

export type AchievementRank =
  | typeof ACHIEVEMENT_RANK_SS
  | typeof ACHIEVEMENT_RANK_S
  | typeof ACHIEVEMENT_RANK_A
  | typeof ACHIEVEMENT_RANK_B
  | typeof ACHIEVEMENT_RANK_C;

/** 達成率の数値をパーセント表記の文字列に変換 */
export function achievementToPercent(achievement: number): string {
  return (achievement * 100).toFixed(2);
}

/**
 * 達成率から SS 〜 C のランクに判定
 *
 * 未クリアの場合は undefined
 */
export function achievementToRank(
  achievement: number,
): AchievementRank | undefined {
  if (achievement >= 0.95) return ACHIEVEMENT_RANK_SS;
  if (achievement >= 0.8) return ACHIEVEMENT_RANK_S;
  if (achievement >= 0.73) return ACHIEVEMENT_RANK_A;
  if (achievement >= 0.63) return ACHIEVEMENT_RANK_B;
  if (achievement > 0) return ACHIEVEMENT_RANK_C;
  return undefined;
}

export function achievementRankToStr(rank: AchievementRank): string {
  switch (rank) {
    case ACHIEVEMENT_RANK_SS:
      return "SS";
    case ACHIEVEMENT_RANK_S:
      return "S";
    case ACHIEVEMENT_RANK_A:
      return "A";
    case ACHIEVEMENT_RANK_B:
      return "B";
    case ACHIEVEMENT_RANK_C:
      return "C";
    default:
      throw neverError(rank);
  }
}
