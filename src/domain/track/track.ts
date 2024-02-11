import { z } from "zod";
import { Difficulty } from "./difficulty";
import { OpenType } from "./open_type";
import { SkillType } from "./skill_type";

// 曲名
export const trackTitleSchema = z.string().min(1);

export const lvSchema = z.number().gt(0).lt(10);

/**
 * 曲の情報
 *
 * 集約ルート
 */
export type Track = Readonly<{
  /** 曲のID */
  id: string;

  /** 曲名 */
  title: string;

  /** アーティスト */
  artist: string;

  /** スキル枠区分 (HOT/OTHER) */
  skillType: SkillType;

  /** long曲かどうか */
  long: boolean;

  /** 開放方法 */
  openType: OpenType;

  /** 曲の譜面 */
  scores: TrackScores;
}>;

/** 曲の全譜面の情報 */
export type TrackScores = {
  readonly [K in Difficulty]?: Score;
};

/** 譜面の情報 */
export type Score = Readonly<{
  /** 曲のID */
  trackId: string;

  /** 難易度 */
  difficulty: Difficulty;

  /**
   * Lv値
   *
   * 0.00 〜 9.99 の float
   */
  lv: number;
}>;

/** 曲のレベルを小数点2桁表記の文字列に変換 */
export function lvToString(lv: number): string {
  return lv.toFixed(2);
}
