export type ScoreFilter = FilterNodeGroup;

export type FilterNode = FilterNodeGroup | FilterNodeNumber | FilterNodeBool;

export type FilterNodeGroup = Readonly<{
  nodeType: "Group";
  logic: "and" | "or";
  nodes: ReadonlyArray<FilterNode>;
}>;

export type FilterNodeNumber = Readonly<{
  nodeType: "Number";
  target: FilterTargetNumber;
  range: FilterRangeNumber;
}>;

export type FilterTargetNumber = "skillType" | "lv" | "like" | "achievement";

export type FilterRangeNumber =
  | FilterRangeNumberOneValue
  | FilterRangeNumberMinMax
  | FilterRangeNumberNull;

export type FilterRangeNumberOneValue = Readonly<{
  rangeType: "Eq" | "Min" | "Max";
  value: number;
}>;

export type FilterRangeNumberMinMax = Readonly<{
  rangeType: "MinMax";
  min: number;
  max: number;
}>;

export type FilterRangeNumberNull = Readonly<{
  rangeType: "Null";
}>;

export type FilterNodeBool = Readonly<{
  nodeType: "Bool";
  target: FilterTargetBool;
  value: boolean;
}>;

export type FilterTargetBool = "isOpen";

export type ScoreOrder = {
  target: ScoreOrderTarget;
  direction: OrderDirection;
};

export type ScoreOrderTarget =
  | "title"
  | "skillType"
  | "long"
  | "difficulty"
  | "lv"
  | "like"
  | "achievement"
  | "skillPoint";

export type OrderDirection = "asc" | "desc";
