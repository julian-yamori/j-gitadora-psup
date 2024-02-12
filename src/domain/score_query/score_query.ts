import { z } from "zod";
import { scoreFilterSchema } from "./score_filter";
import { scoreOrderSchema } from "./score_order";

export const scoreQuerySchema = z.object({
  filter: scoreFilterSchema,
  order: scoreOrderSchema,
});
export type ScoreQuery = Readonly<z.infer<typeof scoreQuerySchema>>;
