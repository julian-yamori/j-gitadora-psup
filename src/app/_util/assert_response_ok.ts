/**
 * response.okでなければ例外を投げる
 * @param response チェックするResponse
 * @returns 引数で渡されたresponse
 * @throws Error response.okがfalsyな場合
 */
export default function assertResponseOk(response: Response): Response {
  if (!response.ok) throw Error(`${response.status} ${response.statusText}`);
  return response;
}
