import { getFormRating } from "./form_convert";

describe("getFormRating", () => {
  it("数値の場合", () => {
    const data = formData("rating", "3");
    expect(getFormRating(data, "rating")).toBe(3);
  });

  it("UI上で空だと空文字列になるので、undefined扱いとする", () => {
    const data = formData("rating", "");
    expect(getFormRating(data, "rating")).toBe(undefined);
  });

  // 値が 0 だと、 UI 上では空と区別が付かなそうなので念の為。
  it("0 は undefined 扱い", () => {
    const data = formData("rating", "0");
    expect(getFormRating(data, "rating")).toBe(undefined);
  });

  it("未定義なら undefined", () => {
    const data = new FormData();
    expect(getFormRating(data, "rating")).toBe(undefined);
  });

  it("非数の文字列ならエラー", () => {
    const data = formData("rating", "test");
    expect(() => getFormRating(data, "rating")).toThrowError();
  });
});

function formData(inputName: string, value: FormDataEntryValue): FormData {
  const data = new FormData();
  data.append(inputName, value);
  return data;
}
