import { Difficulty, difficultyFromNum } from "@/domain/track/difficulty";
import { SkillType, skillTypeSchema } from "@/domain/track/skill_type";
import {
  verifyBoolFromUnknown,
  verifyNumFromUnknown,
  verifyNumOptFromUnknown,
  verifyObjectFromUnknown,
  verifyStrFromUnknown,
} from "@/utils/varify_from_unknown";

export type ScoreListDto = Readonly<{
  trackId: string;
  title: string;
  skillType: SkillType;
  long: boolean;

  difficulty: Difficulty;
  lv: number;

  like: number | undefined;

  achievement: number | undefined;
  skillPoint: number | undefined;
}>;

export function verifyScoreListDtoFromUnknown(value: unknown): ScoreListDto {
  const obj = verifyObjectFromUnknown(value);

  return {
    trackId: verifyStrFromUnknown(obj.trackId),
    title: verifyStrFromUnknown(obj.title),
    skillType: skillTypeSchema.parse(obj.skillType),
    long: verifyBoolFromUnknown(obj.long),
    difficulty: difficultyFromNum(verifyNumFromUnknown(obj.difficulty)),
    lv: verifyNumFromUnknown(obj.lv),
    like: verifyNumOptFromUnknown(obj.like),
    achievement: verifyNumOptFromUnknown(obj.achievement),
    skillPoint: verifyNumOptFromUnknown(obj.skillPoint),
  };
}
