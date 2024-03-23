import {
  getFormCheckbox,
  getFormNumberText,
  getFormRating,
} from "../../_util/form_convert";
import {
  FilterNode,
  FilterRangeNumber,
  ScoreFilter,
} from "../../../domain/score_query/score_filter";
import { Err, Ok, Result } from "../../../utils/result";

export default function scoreFilterFromForm(
  form: FormData,
): Result<ScoreFilter, string> {
  const nodes: FilterNode[] = [];

  pushIfExist(nodes, skillTypeNode(form));
  pushIfExist(nodes, lvNode(form));
  pushIfExist(nodes, likeNode(form));
  pushIfExist(nodes, achievementNode(form));
  pushIfExist(nodes, isOpenNode(form));

  if (nodes.length === 0) {
    return new Err("有効な検索条件が入力されていません。");
  }

  return new Ok({
    nodeType: "Group",
    logic: "and",
    nodes,
  });
}

function pushIfExist<T>(array: Array<T>, item: T | undefined) {
  if (item !== undefined) {
    array.push(item);
  }
}

function skillTypeNode(form: FormData): FilterNode | undefined {
  if (!getFormCheckbox(form, "enable_skilltype")) {
    return undefined;
  }

  const value = getFormNumberText(form, "skilltype");
  if (value === undefined) return undefined;

  return {
    nodeType: "Number",
    target: "skillType",
    range: { rangeType: "Eq", value },
  };
}

function lvNode(form: FormData): FilterNode | undefined {
  if (!getFormCheckbox(form, "enable_lv")) {
    return undefined;
  }

  const range = numberRange(
    getFormNumberText(form, "lv_min"),
    getFormNumberText(form, "lv_max"),
  );
  if (range === undefined) return undefined;

  return {
    nodeType: "Number",
    target: "lv",
    range,
  };
}

function likeNode(form: FormData): FilterNode | undefined {
  if (!getFormCheckbox(form, "enable_like")) {
    return undefined;
  }

  const value = getFormRating(form, "like");

  return {
    nodeType: "Number",
    target: "like",
    range:
      value !== undefined ? { rangeType: "Min", value } : { rangeType: "Null" },
  };
}

function achievementNode(form: FormData): FilterNode | undefined {
  if (!getFormCheckbox(form, "enable_achievement")) {
    return undefined;
  }

  const cnvInput = (name: string): number | undefined => {
    const n = getFormNumberText(form, name);
    if (n === undefined) return n;
    else return n / 100;
  };

  const range = numberRange(
    cnvInput("achievement_min"),
    cnvInput("achievement_max"),
  );
  if (range === undefined) return undefined;

  return {
    nodeType: "Number",
    target: "achievement",
    range,
  };
}

function isOpenNode(form: FormData): FilterNode | undefined {
  if (!getFormCheckbox(form, "enable_isopen")) {
    return undefined;
  }

  return {
    nodeType: "Bool",
    target: "isOpen",
    value: getFormCheckbox(form, "isopen"),
  };
}

function numberRange(
  left: number | undefined,
  right: number | undefined,
): FilterRangeNumber | undefined {
  const hasLeft = left !== undefined;
  const hasRight = right !== undefined;

  if (hasLeft && hasRight) {
    return {
      rangeType: "MinMax",
      min: Math.min(left, right),
      max: Math.max(left, right),
    };
  } else if (hasLeft) {
    return {
      rangeType: "Min",
      value: left,
    };
  } else if (hasRight) {
    return {
      rangeType: "Max",
      value: right,
    };
  } else {
    return undefined;
  }
}
