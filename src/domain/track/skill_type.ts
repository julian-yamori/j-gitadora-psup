/** SkillPointの枠区分 : HOT */
export const HOT = 1;

/** SkillPointの枠区分 : OTHER */
export const OTHER = 2;

/** SkillPointの枠区分 (HOT/OTHER) */
export type SkillType = typeof HOT | typeof OTHER;

/** SkillTypeをnumber型から変換 */
export function skillTypeFromNum(value: number): SkillType {
  switch (value) {
    case HOT:
    case OTHER:
      return value;
    default:
      throw Error(`invalid SkillType : ${value}`);
  }
}

/** SkillTypeを表示用の文字列に変換 */
export function skillTypeToStr(value: SkillType): string {
  switch (value) {
    case HOT:
      return "HOT";
    case OTHER:
      return "OTHER";
  }
}
