/** 曲の難易度 : BASIC */
export const BASIC = 1;
/** 曲の難易度 : ADVANCED */
export const ADVANCED = 2;
/** 曲の難易度 : EXTREME */
export const EXTREME = 3;
/** 曲の難易度 : MASTER */
export const MASTER = 4;

/** 曲の難易度 */
export type Difficulty =
  | typeof BASIC
  | typeof ADVANCED
  | typeof EXTREME
  | typeof MASTER;

/** OpenTypeをnumber型から変換 */
export function difficultyFromNum(value: number): Difficulty {
  switch (value) {
    case BASIC:
    case ADVANCED:
    case EXTREME:
    case MASTER:
      return value;
    default:
      throw Error(`invalid SkillType : ${value}`);
  }
}

/** OpenTypeを表示用の文字列に変換 */
export function difficultyToStr(value: Difficulty): string {
  switch (value) {
    case BASIC:
      return "BASIC";
    case ADVANCED:
      return "ADVANCED";
    case EXTREME:
      return "EXTREME";
    case MASTER:
      return "MASTER";
  }
}
