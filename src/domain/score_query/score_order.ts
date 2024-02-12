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

export const scoreOrderItemSchema = z
  .object({
    target: scoreOrderTargetSchema,
    direction: orderDirectionSchema,
  })
  .readonly();
export type ScoreOrderItem = z.infer<typeof scoreOrderItemSchema>;

// 譜面のソート順定義
// 先頭の ScoreOrderItem ほど優先
export const scoreOrderSchema = z.array(scoreOrderItemSchema).readonly();
export type ScoreOrder = z.infer<typeof scoreOrderSchema>;

// 最も優先度が高いソートルールを取得
export function primaryScoreOrder(
  order: ScoreOrder,
): ScoreOrderItem | undefined {
  return order.at(0);
}

export function scoreOrderSetItem(
  order: ScoreOrder,
  newItem: ScoreOrderItem,
): ScoreOrder {
  // 同一 target のルールは上書きするため除去
  const newOrder = order.filter((i) => i.target !== newItem.target);

  // 先頭に追加
  newOrder.splice(0, 0, newItem);

  return newOrder;
}
