import { z } from "zod";

// 達成率 (0〜1のfloat)
export const achievementSchema = z.number().nonnegative().max(1);

/** 達成率の数値をパーセント表記の文字列に変換 */
export function achievementToPercent(achievement: number): string {
  return (achievement * 100).toFixed(2);
}
