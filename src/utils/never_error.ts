/**
 * 値が never 型だった場合のエラーを生成
 *
 * switch 文などの型チェック漏れ用
 * https://qiita.com/sosomuse/items/b7b36b95686b83ec36f4
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- never のため使用不可
export default function neverError(_: never) {
  return new Error("This code should not be called");
}
