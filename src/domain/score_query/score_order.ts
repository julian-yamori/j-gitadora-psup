import { z } from "zod";

const scoreOrderTargetSchema = z.union([
  z.literal("title"),
  z.literal("skillType"),
  z.literal("long"),
  z.literal("difficulty"),
  z.literal("lv"),
  z.literal("like"),
  z.literal("achievement"),
  z.literal("skillPoint"),
]);
export type ScoreOrderTarget = z.infer<typeof scoreOrderTargetSchema>;

const orderDirectionSchema = z.union([z.literal("asc"), z.literal("desc")]);
export type OrderDirection = z.infer<typeof orderDirectionSchema>;

export const scoreOrderSchema = z.object({
  target: scoreOrderTargetSchema,
  direction: orderDirectionSchema,
});
export type ScoreOrder = z.infer<typeof scoreOrderSchema>;
