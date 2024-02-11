import { difficultySchema } from "@/domain/track/difficulty";
import { skillTypeSchema } from "@/domain/track/skill_type";
import { lvSchema, trackTitleSchema } from "@/domain/track/track";
import {
  achievementSchema,
  likeSchema,
  skillPointSchema,
} from "@/domain/track/user_track";
import {
  verifyBoolFromUnknown,
  verifyNumFromUnknown,
  verifyNumOptFromUnknown,
  verifyObjectFromUnknown,
  verifyStrFromUnknown,
} from "@/utils/varify_from_unknown";
import { z } from "zod";

export const scoreListDtoSchema = z.object({
  trackId: z.string(),
  title: trackTitleSchema,
  skillType: skillTypeSchema,
  long: z.boolean(),

  difficulty: difficultySchema,
  lv: lvSchema,

  like: likeSchema.optional(),

  achievement: achievementSchema.optional(),
  skillPoint: skillPointSchema.optional(),
});
export type ScoreListDto = Readonly<z.infer<typeof scoreListDtoSchema>>;

export function verifyScoreListDtoFromUnknown(value: unknown): ScoreListDto {
  const obj = verifyObjectFromUnknown(value);

  return {
    trackId: verifyStrFromUnknown(obj.trackId),
    title: verifyStrFromUnknown(obj.title),
    skillType: skillTypeSchema.parse(obj.skillType),
    long: verifyBoolFromUnknown(obj.long),
    difficulty: difficultySchema.parse(obj.difficulty),
    lv: verifyNumFromUnknown(obj.lv),
    like: verifyNumOptFromUnknown(obj.like),
    achievement: verifyNumOptFromUnknown(obj.achievement),
    skillPoint: verifyNumOptFromUnknown(obj.skillPoint),
  };
}
