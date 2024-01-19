import { Difficulty } from "@/domain/track/difficulty";
import { OpenType } from "@/domain/track/open_type";
import { SkillType } from "@/domain/track/skill_type";

/**
 * 曲一覧画面に表示するためのDTO
 */
export type TrackListDto = Readonly<{
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

  /** 全譜面情報 */
  scores: ReadonlyArray<TrackListScoreDto>;
}>;

/**
 * 曲一覧画面に表示する曲の、譜面ごとのDTO
 */
export type TrackListScoreDto = Readonly<{
  difficulty: Difficulty;
  lv: number;
}>;
