import { z } from "zod";
import { achievementSchema } from "../../domain/track/achievement";
import { difficultySchema } from "../../domain/track/difficulty";
import { skillTypeSchema } from "../../domain/track/skill_type";
import { lvSchema, trackTitleSchema } from "../../domain/track/track";
import { likeSchema, skillPointSchema } from "../../domain/track/user_track";

const scoreListDtoRowSchema = z
  .object({
    trackId: z.string(),
    title: trackTitleSchema,
    skillType: skillTypeSchema,
    long: z.boolean(),

    difficulty: difficultySchema,
    lv: lvSchema,

    like: likeSchema.optional(),

    achievement: achievementSchema.optional(),
    skillPoint: skillPointSchema.optional(),
  })
  .readonly();
export type ScoreListDtoRow = z.infer<typeof scoreListDtoRowSchema>;

export const scoreListDtoSchema = z
  .object({
    rows: z.array(scoreListDtoRowSchema).readonly(),
    count: z.number().int().gte(0),
  })
  .readonly();
export type ScoreListDto = z.infer<typeof scoreListDtoSchema>;
