import { z } from "zod";

const filterTargetBoolSchema = z.literal("isOpen");
export type FilterTargetBool = z.infer<typeof filterTargetBoolSchema>;

const filterNodeBoolSchema = z
  .object({
    // FilterNode の型識別用の値
    nodeType: z.literal("Bool"),

    // フィルタの値の比較対象の項目
    target: filterTargetBoolSchema,

    // この値に等しいレコードを抽出
    value: z.boolean(),
  })
  .readonly();
export type FilterNodeBool = z.infer<typeof filterNodeBoolSchema>;

const filterTargetNumberSchema = z.union([
  z.literal("skillType"),
  z.literal("lv"),
  z.literal("like"),
  z.literal("achievement"),
]);
export type FilterTargetNumber = z.infer<typeof filterTargetNumberSchema>;

const filterRangeNumberOneValueSchema = z
  .object({
    // FilterRangeNumber の型識別用の値 (値の範囲の指定方法)
    rangeType: z.union([z.literal("Eq"), z.literal("Min"), z.literal("Max")]),

    // この値と比較して 等しい/以上/以下 のレコードを抽出
    value: z.number(),
  })
  .readonly();
export type FilterRangeNumberOneValue = z.infer<
  typeof filterRangeNumberOneValueSchema
>;

const filterRangeNumberMinMaxSchema = z
  .object({
    // FilterRangeNumber の型識別用の値
    rangeType: z.literal("MinMax"),

    // この値以上のレコードを抽出
    min: z.number(),

    // この値以下のレコードを抽出
    max: z.number(),
  })
  .readonly();
export type FilterRangeNumberMinMax = z.infer<
  typeof filterRangeNumberMinMaxSchema
>;

const filterRangeNumberNullSchema = z
  .object({
    // FilterRangeNumber の型識別用の値
    rangeType: z.literal("Null"),
  })
  .readonly();
export type FilterRangeNumberNull = z.infer<typeof filterRangeNumberNullSchema>;

const filterRangeNumberSchema = z.union([
  filterRangeNumberOneValueSchema,
  filterRangeNumberMinMaxSchema,
  filterRangeNumberNullSchema,
]);
export type FilterRangeNumber = z.infer<typeof filterRangeNumberSchema>;

const filterNodeNumberSchema = z
  .object({
    // FilterNode の型識別用の値
    nodeType: z.literal("Number"),

    // フィルタの値の比較対象の項目
    target: filterTargetNumberSchema,

    // 値の比較方法
    range: filterRangeNumberSchema,
  })
  .readonly();
export type FilterNodeNumber = z.infer<typeof filterNodeNumberSchema>;

const baseFilterNodeGroupSchema = z.object({
  // FilterNode の型識別用の値
  nodeType: z.literal("Group"),

  logic: z.union([z.literal("and"), z.literal("or")]),
});
export type FilterNodeGroup = Readonly<
  z.infer<typeof baseFilterNodeGroupSchema> & {
    nodes: ReadonlyArray<FilterNode>;
  }
>;

const filterNodeGroupSchema: z.ZodType<FilterNodeGroup> =
  baseFilterNodeGroupSchema
    .extend({
      nodes: z.lazy(() => filterNodeSchema.array().nonempty().readonly()),
    })
    .readonly();

const filterNodeSchema = z.union([
  filterNodeNumberSchema,
  filterNodeBoolSchema,
  filterNodeGroupSchema,
]);
export type FilterNode = z.infer<typeof filterNodeSchema>;

export const scoreFilterSchema = filterNodeGroupSchema;
export type ScoreFilter = FilterNodeGroup;
