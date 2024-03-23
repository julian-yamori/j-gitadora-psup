import { z } from "zod";
import neverError from "../../utils/never_error";

/** SkillPointの枠区分 : HOT */
export const HOT = 1;

/** SkillPointの枠区分 : OTHER */
export const OTHER = 2;

export const skillTypeSchema = z.union([z.literal(HOT), z.literal(OTHER)]);
/** SkillPointの枠区分 (HOT/OTHER) */
export type SkillType = z.infer<typeof skillTypeSchema>;

/** SkillTypeを表示用の文字列に変換 */
export function skillTypeToStr(value: SkillType): string {
  switch (value) {
    case HOT:
      return "HOT";
    case OTHER:
      return "OTHER";
    default:
      throw neverError(value);
  }
}
