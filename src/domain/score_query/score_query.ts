import { z } from "zod";
import { scoreFilterSchema } from "./score_filter";
import { scoreOrderSchema } from "./score_order";
import { pagingSchema } from "./paging";

export const scoreQuerySchema = z
  .object({
    filter: scoreFilterSchema,
    order: scoreOrderSchema,
    paging: pagingSchema,
  })
  .readonly();
export type ScoreQuery = z.infer<typeof scoreQuerySchema>;
