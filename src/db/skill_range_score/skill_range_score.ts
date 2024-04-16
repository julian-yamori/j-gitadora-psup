import { Difficulty } from "../../domain/track/difficulty";
import { HOT, OTHER, SkillType } from "../../domain/track/skill_type";

const SKILL_RANGE = 25;

/** スキル対象曲のリスト (26位以降の対象外の曲も含みうる) */
export type SkillScoreList = {
  [K in SkillType]: ReadonlyArray<SkillRangeScore>;
};

/** スキル対象曲1つの情報 */
export type SkillRangeScore = Readonly<{
  trackId: string;
  difficulty: Difficulty;

  title: string;
  lv: number;
  achievement: number;
  skillPoint: number;
}>;

export function sumSkillPoint(skillScoreList: SkillScoreList): number {
  return (
    sumPerSkillType(skillScoreList[HOT]) +
    sumPerSkillType(skillScoreList[OTHER])
  );
}

function sumPerSkillType(scores: ReadonlyArray<SkillRangeScore>): number {
  return scores.slice(0, SKILL_RANGE).reduce((p, v) => p + v.skillPoint, 0);
}
