import { Err, Ok, Result } from "./result";

describe("Result.isOk", () => {
  it("okならtrue", () => {
    expect(new Ok(1).isOk()).toBe(true);
  });
  it("errならfalse", () => {
    expect(new Err("hoge").isOk()).toBe(false);
  });
});

describe("Result.isErr", () => {
  it("okならfalse", () => {
    expect(new Ok(1).isErr()).toBe(false);
  });
  it("errならtrue", () => {
    expect(new Err("hoge").isErr()).toBe(true);
  });
});

describe("Result.unwrap", () => {
  it("okなら中身の値を取り出す", () => {
    expect(new Ok(1).unwrap()).toBe(1);
  });
  it("errならthrow", () => {
    expect(() => new Err("error message").unwrap()).toThrow(Error);
  });
});

describe("Result.unwrapOrElse", () => {
  const count = (x: string): number => x.length;

  it("okなら中身の値を取り出す", () => {
    const result: Result<number, string> = new Ok(2);
    expect(result.unwrapOrElse(count)).toBe(2);
  });
  it("errなら、関数の結果を返す", () => {
    const result: Result<number, string> = new Err("foo");
    expect(result.unwrapOrElse(count)).toBe(3);
  });
});

describe("Result.unwrapErr", () => {
  it("okならthrow", () => {
    expect(() => new Ok(2).unwrapErr()).toThrow(Error);
  });
  it("errなら引数で渡した関数の結果を返す", () => {
    expect(new Err("error message").unwrapErr()).toBe("error message");
  });
});

describe("Result.map", () => {
  const op = (okValue: number): string => (okValue * 2).toString();

  it("okなら値を変換する", () => {
    expect(new Ok(5).map(op).unwrap()).toBe("10");
  });
  it("errなら値はそのまま", () => {
    expect(new Err<number, string>("hoge").map(op).unwrapErr()).toBe("hoge");
  });
});

describe("Result.mapErr", () => {
  const stringify = (x: number): string => `error code: ${x}`;

  it("okなら値はそのまま", () => {
    const x = new Ok<number, number>(2);
    expect(x.mapErr(stringify).unwrap()).toBe(2);
  });
  it("errなら値を変換する", () => {
    const x = new Err<number, number>(13);
    expect(x.mapErr(stringify).unwrapErr()).toBe("error code: 13");
  });
});

describe("Result.andThen", () => {
  const f = (x: number): Result<string, string> => {
    if (x >= 10000) return new Err("too big");
    return new Ok(x.toString());
  };

  it("自身と関数の結果が共にokなら、関数の結果のokを返す", () => {
    expect(new Ok(2).andThen(f).unwrap()).toBe("2");
  });
  it("自身はokだが関数の結果がerrなら、関数の結果のerrを返す", () => {
    expect(new Ok(50000).andThen(f).unwrapErr()).toBe("too big");
  });
  it("自身がerrなら、そのerrを返す", () => {
    expect(new Err<number, string>("not a number").andThen(f).unwrapErr()).toBe(
      "not a number",
    );
  });
});
