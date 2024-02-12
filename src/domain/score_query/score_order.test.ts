import { ScoreOrder, ScoreOrderItem, scoreOrderSetItem } from "./score_order";

describe("scoreOrderSetItem", () => {
  it("元々空の場合", () => {
    const old: ScoreOrder = [];
    const item: ScoreOrderItem = { target: "title", direction: "asc" };

    expect(scoreOrderSetItem(old, item)).toEqual([item]);
  });

  it("重複しない要素を set する場合、先頭に挿入", () => {
    const old: ScoreOrder = [
      { target: "skillType", direction: "asc" },
      { target: "like", direction: "desc" },
    ];
    const item: ScoreOrderItem = { target: "achievement", direction: "asc" };

    expect(scoreOrderSetItem(old, item)).toEqual([item, ...old]);
  });

  it("重複しない要素を set する場合、上書きして先頭に移動", () => {
    const old: ScoreOrder = [
      { target: "skillType", direction: "asc" },
      { target: "achievement", direction: "desc" },
      { target: "like", direction: "desc" },
    ];
    const item: ScoreOrderItem = { target: "achievement", direction: "asc" };
    const result = [
      { target: "achievement", direction: "asc" },
      { target: "skillType", direction: "asc" },
      { target: "like", direction: "desc" },
    ];

    expect(scoreOrderSetItem(old, item)).toEqual(result);
  });
});
