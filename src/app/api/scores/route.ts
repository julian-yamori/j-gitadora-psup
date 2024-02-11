import prismaClient from "@/db/prisma_client";
import queryScoreList from "@/db/score_list/score_list_query_service";
import { scoreFilterSchema } from "@/domain/score_query/score_filter";

/** 譜面クエリ画面の検索条件フォームからのリクエストを受け付けて、譜面リストを返す */
// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST(request: Request): Promise<Response> {
  const json = await request.text();
  const filter = scoreFilterSchema.parse(JSON.parse(json));

  const scores = await queryScoreList(prismaClient, filter);

  return new Response(JSON.stringify(scores));
}
