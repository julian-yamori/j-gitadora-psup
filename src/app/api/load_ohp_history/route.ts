let testCache = new Map<string, string>();

export function getTestCache() {
  return testCache;
}

/** 公式HP のプレイ履歴を登録 */
// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST(request: Request): Promise<Response> {
  const json = await request.text();
  const array = JSON.parse(json);

  testCache = new Map(array);

  return new Response();
}
