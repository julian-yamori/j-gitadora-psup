import { z } from "zod";

const filterTargetBoolSchema = z.literal("isOpen");
export type FilterTargetBool = Readonly<z.infer<typeof filterTargetBoolSchema>>;

const filterNodeBoolSchema = z.object({
  // FilterNode の型識別用の値
  nodeType: z.literal("Bool"),

  // フィルタの値の比較対象の項目
  target: filterTargetBoolSchema,

  // この値に等しいレコードを抽出
  value: z.boolean(),
});
export type FilterNodeBool = Readonly<z.infer<typeof filterNodeBoolSchema>>;

const filterTargetNumberSchema = z.union([
  z.literal("skillType"),
  z.literal("lv"),
  z.literal("like"),
  z.literal("achievement"),
]);
export type FilterTargetNumber = Readonly<
  z.infer<typeof filterTargetNumberSchema>
>;

const filterRangeNumberOneValueSchema = z.object({
  // FilterRangeNumber の型識別用の値 (値の範囲の指定方法)
  rangeType: z.union([z.literal("Eq"), z.literal("Min"), z.literal("Max")]),

  // この値と比較して 等しい/以上/以下 のレコードを抽出
  value: z.number(),
});
export type FilterRangeNumberOneValue = Readonly<
  z.infer<typeof filterRangeNumberOneValueSchema>
>;

const filterRangeNumberMinMaxSchema = z.object({
  // FilterRangeNumber の型識別用の値
  rangeType: z.literal("MinMax"),

  // この値以上のレコードを抽出
  min: z.number(),

  // この値以下のレコードを抽出
  max: z.number(),
});
export type FilterRangeNumberMinMax = Readonly<
  z.infer<typeof filterRangeNumberMinMaxSchema>
>;

const filterRangeNumberNullSchema = z.object({
  // FilterRangeNumber の型識別用の値
  rangeType: z.literal("Null"),
});
export type FilterRangeNumberNull = Readonly<
  z.infer<typeof filterRangeNumberNullSchema>
>;

const filterRangeNumberSchema = z.union([
  filterRangeNumberOneValueSchema,
  filterRangeNumberMinMaxSchema,
  filterRangeNumberNullSchema,
]);
export type FilterRangeNumber = Readonly<
  z.infer<typeof filterRangeNumberSchema>
>;

const filterNodeNumberSchema = z.object({
  // FilterNode の型識別用の値
  nodeType: z.literal("Number"),

  // フィルタの値の比較対象の項目
  target: filterTargetNumberSchema,

  // 値の比較方法
  range: filterRangeNumberSchema,
});
export type FilterNodeNumber = Readonly<z.infer<typeof filterNodeNumberSchema>>;

const baseFilterNodeGroupSchema = z.object({
  // FilterNode の型識別用の値
  nodeType: z.literal("Group"),

  logic: z.union([z.literal("and"), z.literal("or")]),
});
export type FilterNodeGroup = Readonly<
  z.infer<typeof baseFilterNodeGroupSchema>
> &
  Readonly<{ nodes: ReadonlyArray<FilterNode> }>;

const filterNodeGroupSchema: z.ZodType<FilterNodeGroup> =
  baseFilterNodeGroupSchema.extend({
    nodes: z.lazy(() => filterNodeSchema.array().nonempty().readonly()),
  });

const filterNodeSchema = z.union([
  filterNodeNumberSchema,
  filterNodeBoolSchema,
  filterNodeGroupSchema,
]);
export type FilterNode = Readonly<z.infer<typeof filterNodeSchema>>;

export const scoreFilterSchema = filterNodeGroupSchema;
export type ScoreFilter = FilterNodeGroup;
