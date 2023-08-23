import { Difficulty } from "./difficulty";
import { OpenType } from "./open_type";
import { SkillType } from "./skill_type";

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

  /** スキル枠区分 (HOT/OTHER) */
  skillType: SkillType;

  /** long曲かどうか */
  long: boolean;

  /** 開放方法 */
  openType: OpenType;

  /** 難易度毎の情報 */
  difficulties: Readonly<Record<Difficulty, TrackByDifficulty>>;
}>;

/** 曲の難易度別の情報 */
export type TrackByDifficulty = Readonly<{
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
