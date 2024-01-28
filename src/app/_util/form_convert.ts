/**
 * リクエストのフォーム入力値を文字列として取得
 * @param form リクエストのFormData
 * @param name フォーム項目のname
 * @throws
 */
export function getFormString(form: FormData, name: string): string {
  const value = form.get(name);
  if (typeof value === "string") return value;
  // nullの場合とFileの場合がある
  throw Error(`form value "${name}" is not string`);
}

/**
 * リクエストのフォーム入力値を数値として取得
 * @param form リクエストのFormData
 * @param name フォーム項目のname
 * @throws
 */
export function getFormNumber(form: FormData, name: string): number {
  const str = getFormString(form, name);
  const num = Number(str);
  if (Number.isNaN(num))
    throw Error(`form value "${name}" is not number : ${str}`);
  else return num;
}

/**
 * リクエストのフォーム入力値を数値として取得 (テキスト用で、未入力ならundefined)
 * @param form リクエストのFormData
 * @param name フォーム項目のname
 * @throws
 */
export function getFormNumberText(
  form: FormData,
  name: string,
): number | undefined {
  const str = getFormString(form, name);
  if (str === "") return undefined;

  const num = Number(str);
  if (Number.isNaN(num))
    throw Error(`form value "${name}" is not number : ${str}`);
  else return num;
}

/**
 * リクエストのフォーム入力値の、単一のチェックボックスがチェックされたかをbooleanとして取得
 * @param form リクエストのFormData
 * @param name フォーム項目のname
 * @throws
 */
export function getFormCheckbox(form: FormData, name: string): boolean {
  return form.has(name);
}

/**
 * リクエストのフォーム入力値の、同じnameの複数チェックボックスのうちチェックされた値を取得
 * @param form リクエストのFormData
 * @param name フォーム項目のname
 * @returns チェックされた全てのチェックボックスのvalue
 * @throws
 */
export function getFormMultiCheckbox(form: FormData, name: string): string[] {
  return form.getAll(name).map((value) => {
    if (typeof value === "string") return value;
    throw Error(`form value in "${name}" is not string`);
  });
}

export function getFormRating(
  form: FormData,
  name: string,
): number | undefined {
  // 0 と null は、undefined扱いの有効値とする
  // todo 未入力は 0 か null か、要確認

  const value = form.get(name);
  if (value === null) return undefined;
  if (typeof value !== "string") {
    throw Error(`form value "${name}" is not number`);
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    throw Error(`form value "${name}" is not number : ${value}`);
  }

  if (num === 0) return undefined;
  return num;
}
