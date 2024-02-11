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
