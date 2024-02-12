import { z } from "zod";
import { scoreFilterSchema } from "./score_filter";
import { scoreOrderSchema } from "./score_order";

export const scoreQuerySchema = z
  .object({
    filter: scoreFilterSchema,
    order: scoreOrderSchema,
  })
  .readonly();
export type ScoreQuery = z.infer<typeof scoreQuerySchema>;
