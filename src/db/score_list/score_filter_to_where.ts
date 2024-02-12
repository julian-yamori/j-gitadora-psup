import {
  FilterNode,
  FilterNodeBool,
  FilterNodeGroup,
  FilterNodeNumber,
  FilterTargetNumber,
  ScoreFilter,
} from "@/domain/score_query/score_filter";

export default function scoreFilterToWhere(scoreFilter: ScoreFilter) {
  return nodeGroupToWhere(scoreFilter);
}

function nodeToWhere(node: FilterNode): any {
  switch (node.nodeType) {
    case "Group":
      return nodeGroupToWhere(node);
    case "Number":
      return nodeNumberToWhere(node);
    case "Bool":
      return nodeBoolToWhere(node);
  }
}

function nodeGroupToWhere(node: FilterNodeGroup) {
  return {
    [groupLogicToPrisma(node.logic)]: node.nodes.map((n) => nodeToWhere(n)),
  };
}

function nodeNumberToWhere(node: FilterNodeNumber) {
  const { target, range } = node;

  switch (range.rangeType) {
    case "Eq":
      return fieldFilterNumber(target, range.value);
    case "Min":
      return fieldFilterNumber(target, { gte: range.value });
    case "Max":
      return fieldFilterNumber(target, { lte: range.value });
    case "MinMax":
      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention -- prismaのANDを使うため大文字許可
        AND: [
          fieldFilterNumber(target, { gte: range.min }),
          fieldFilterNumber(target, { lte: range.max }),
        ],
      };
    case "Null":
      return fieldFilterNumber(target, null);
  }
}

function fieldFilterNumber(target: FilterTargetNumber, condition: any) {
  switch (target) {
    case "lv":
      return { [target]: condition };
    case "skillType":
      return { track: { [target]: condition } };
    case "like":
      return { track: { userTrack: { [target]: condition } } };
    case "achievement":
      return { userScore: { [target]: condition } };
  }
}

function nodeBoolToWhere(node: FilterNodeBool) {
  const { target, value } = node;

  switch (target) {
    case "isOpen":
      return { track: { userTrack: { [target]: value } } };
  }
}

function groupLogicToPrisma(logic: "and" | "or") {
  switch (logic) {
    case "and":
      return "AND";
    case "or":
      return "OR";
  }
}
