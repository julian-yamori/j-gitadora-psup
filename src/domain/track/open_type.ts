/** 曲の開放方法の種別 : 初期開放 */
export const INITIAL = 0;
/** 曲の開放方法の種別 : ENCORE */
export const ENCORE = 1;
/** 曲の開放方法の種別 : PREMIUM ENCORE */
export const PREMIUM_ENCORE = 2;
/** 曲の開放方法の種別 : イベント */
export const EVENT = 3;
/** 曲の開放方法の種別 : GITADORA オールスター GIG！ */
export const LIVE_HOUSE = 4;

/** 曲の開放方法の種別 */
export type OpenType =
  | typeof INITIAL
  | typeof ENCORE
  | typeof PREMIUM_ENCORE
  | typeof EVENT
  | typeof LIVE_HOUSE;

/** OpenTypeをnumber型から変換 */
export function openTypeFromNum(value: number): OpenType {
  switch (value) {
    case INITIAL:
    case ENCORE:
    case PREMIUM_ENCORE:
    case EVENT:
    case LIVE_HOUSE:
      return value;
    default:
      throw Error(`invalid SkillType : ${value}`);
  }
}

/** OpenTypeを表示用の文字列に変換 */
export function openTypeToStr(value: OpenType): string {
  switch (value) {
    case INITIAL:
      return "初期開放";
    case ENCORE:
      return "ENCORE";
    case PREMIUM_ENCORE:
      return "PREMIUM ENCORE";
    case EVENT:
      return "イベント";
    case LIVE_HOUSE:
      return "ライブハウス";
  }
}
