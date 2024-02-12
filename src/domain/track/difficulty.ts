import neverError from "@/utils/never_error";
import { z } from "zod";

/** 曲の難易度 : BASIC */
export const BASIC = 1;
/** 曲の難易度 : ADVANCED */
export const ADVANCED = 2;
/** 曲の難易度 : EXTREME */
export const EXTREME = 3;
/** 曲の難易度 : MASTER */
export const MASTER = 4;

export const difficultySchema = z.union([
  z.literal(BASIC),
  z.literal(ADVANCED),
  z.literal(EXTREME),
  z.literal(MASTER),
]);
/** 曲の難易度 */
export type Difficulty = z.infer<typeof difficultySchema>;

export const ALL_DIFFICULTIES: ReadonlyArray<Difficulty> = [
  BASIC,
  ADVANCED,
  EXTREME,
  MASTER,
];

/** Difficulty を表示用の文字列に変換 */
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
    default:
      throw neverError(value);
  }
}
