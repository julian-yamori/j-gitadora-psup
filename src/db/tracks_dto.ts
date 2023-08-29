import { Difficulty } from "@/domain/track/difficulty";
import { OpenType } from "@/domain/track/open_type";
import { SkillType } from "@/domain/track/skill_type";

/**
 * 曲一覧画面に表示するためのDTO
 */
export type TracksDto = Readonly<{
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

  /** 難易度ごとのLv */
  difficulties: ReadonlyArray<TracksDtoLvs>;
}>;

/**
 * 曲一覧画面に表示する曲の、難易度1つごとのDTO
 */
export type TracksDtoLvs = Readonly<{
  difficulty: Difficulty;
  lv: number;
}>;
