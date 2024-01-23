import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track/track_repository";
import RegisterQueryService from "@/db/wiki_loading/register_query_service";
import WikiLoadingIssueRepository from "@/db/wiki_loading/wiki_loading_issue_repository";
import registerFromIssues from "@/domain/wiki_loading/register_from_issues";

/** issuesに登録されたwikiの曲リスト問題点から、曲リストに登録 */
// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST() {
  await prismaClient.$transaction(
    async (tx) => {
      await registerFromIssues(
        await new RegisterQueryService(tx).issues(),
        new TrackRepository(tx),
      );
      await new WikiLoadingIssueRepository(tx).deleteAll();
    },
    { timeout: 30000 },
  );

  return new Response();
}
