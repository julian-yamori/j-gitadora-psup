/**
 * 処理に失敗するかもしれない関数の戻り値
 *
 * https://qiita.com/Kodak_tmo/items/d48eb3497be18896b999
 * 命名やヘルパー関数はRustの真似
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

/** Result型の、成功したことを表す値 */
export class Ok<T, E> {
  /** 関数の戻り値本体の値 */
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  /**
   * 中身の値を、成功とみなして取り出す
   * @returns 成功状態の値
   * @throws Error このResultが失敗状態だった場合
   */
  unwrap(): T {
    return this.value;
  }

  /**
   * 中身の値を取り出す。errだった場合は、代わりに引数で指定した関数の結果を返す。
   * @param f errだった場合に、代わりの値を取得する関数 (引数にerrの値を受け取る)
   * @returns 中身の値。errの場合は関数fを実行した結果。
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Okの場合は使用しない
  unwrapOrElse(f: (errValue: E) => T): T {
    return this.value;
  }

  /**
   * エラーの値を、失敗とみなして取り出す
   * @returns 失敗状態の値
   * @throws Error このResultが成功状態だった場合
   */
  unwrapErr(): E {
    throw new Error("Result.unwrap_err : result is ok.");
  }

  /**
   * Result<T, E>をResult<U, E>に変換する。
   *
   * okの場合、中身の値を別の値に置き換える。
   * errの場合はそのまま。
   * @param op okの値を変換する関数
   * @returns okの場合に値が置き換えられたResult
   */
  map<U>(op: (okValue: T) => U): Result<U, E> {
    return new Ok(op(this.value));
  }

  /**
   * Result<T, E>をResult<T, F>に変換する。
   *
   * okの場合はそのまま。
   * errの場合、エラー値を別の値に置き換える。
   * @param op errの値を変換する関数
   * @returns errの場合に値が置き換えられたResult
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Okの場合は使用しない
  mapErr<F>(op: (errValue: E) => F): Result<T, F> {
    return this as unknown as Ok<T, F>;
  }

  /**
   * このResultと、関数opの実行結果が両方ともokなら、okの結果を返す
   * @param op このResultがokの場合に呼ばれる関数
   * @returns okの場合に値が書き換えられたResult
   */
  andThen<U>(op: (okValue: T) => Result<U, E>): Result<U, E> {
    return op(this.value);
  }
}

/** Result型の、失敗したことを表す値 */
export class Err<T, E> {
  /** エラー内容 */
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  /**
   * 中身の値を、成功とみなして取り出す
   * @returns 成功状態の値
   * @throws Error このResultが失敗状態だった場合
   */
  unwrap(): T {
    throw new Error("Result.unwrap : result is err.");
  }

  /**
   * 中身の値を取り出す。errだった場合は、代わりに引数で指定した関数の結果を返す。
   * @param f errだった場合に、代わりの値を取得する関数 (引数にerrの値を受け取る)
   * @returns 中身の値。errの場合は関数fを実行した結果。
   */
  unwrapOrElse(f: (errValue: E) => T): T {
    return f(this.error);
  }

  /**
   * エラーの値を、失敗とみなして取り出す
   * @returns 失敗状態の値
   * @throws Error このResultが成功状態だった場合
   */
  unwrapErr(): E {
    return this.error;
  }

  /*
   * Result<T, E>をResult<U, E>に変換する。
   *
   * okの場合、中身の値を別の値に置き換える。
   * errの場合はそのまま。
   * @param op okの値を変換する関数
   * @returns okの場合に値が置き換えられたResult
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Errの場合は使用しない
  map<U>(op: (okValue: T) => U): Result<U, E> {
    return this as unknown as Err<U, E>;
  }

  /**
   * Result<T, E>をResult<T, F>に変換する。
   *
   * okの場合はそのまま。
   * errの場合、エラー値を別の値に置き換える。
   * @param op errの値を変換する関数
   * @returns errの場合に値が置き換えられたResult
   */
  mapErr<F>(op: (errValue: E) => F): Result<T, F> {
    return new Err(op(this.error));
  }

  /**
   * このResultと、関数opの実行結果が両方ともokなら、okの結果を返す
   * @param op このResultがokの場合に呼ばれる関数
   * @returns okの場合に値が書き換えられたResult
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Errの場合は使用しない
  andThen<U>(op: (okValue: T) => Result<U, E>): Result<U, E> {
    return this as unknown as Err<U, E>;
  }
}

/**
 * Result<T, E>[] を Result<T[], E>に変換
 *
 * RustでいうとIterator::<Item = Result<T, E>>::collect(&self) -> Result<Vec<T>, E>
 * @param results Resultの配列
 * @returns
 * 全てのResultがOkだった場合、Okの値の配列。
 * 一つでもErrがある場合、最初のErrの値
 */
export function resultCollectArray<T, E>(
  results: ReadonlyArray<Result<T, E>>,
): Result<T[], E> {
  const arr: T[] = [];

  for (const r of results) {
    if (r.isOk()) arr.push(r.value);
    else return new Err(r.error);
  }

  return new Ok(arr);
}
