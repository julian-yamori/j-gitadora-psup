import { RefObject } from "react";

/**
 * NonNullであると確信できるRefObjectのcurrentを取得
 *
 * @throws Error ref.currentがnullの場合
 */
export default function getRefNonNull<T>(ref: RefObject<T>): T {
  const { current } = ref;
  if (current === null) throw Error("ref.current is null");
  return current;
}
