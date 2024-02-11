import { difficultySchema } from "@/domain/track/difficulty";
import { skillTypeSchema } from "@/domain/track/skill_type";
import { lvSchema, trackTitleSchema } from "@/domain/track/track";
import {
  achievementSchema,
  likeSchema,
  skillPointSchema,
} from "@/domain/track/user_track";
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
