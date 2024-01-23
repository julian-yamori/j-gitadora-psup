import { getFormString } from "@/app/_util/form_convert";
import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track/track_repository";
import LoadWikiHtmlQueryService from "@/db/wiki_loading/load_wiki_html_query_service";
import WikiLoadingIssueRepository from "@/db/wiki_loading/wiki_loading_issue_repository";
import loadWikiHTML from "@/domain/wiki_loading/load_wiki_html";

/** wikiの曲リストHTMLを読み込んで、issuesとして保存 */
// eslint-disable-next-line import/prefer-default-export -- defaultにするとメソッド名を認識しなくなる
export async function POST(request: Request) {
  const form = await request.formData();
  const newTracksHTML = getFormString(form, "new");
  const oldGFDMTracksHTML = getFormString(form, "old_gfdm");
  const oldGDTracksHTML = getFormString(form, "old_gd");

  await prismaClient.$transaction(
    async (tx) => {
      const issues = await loadWikiHTML({
        newTracksHTML,
        oldGFDMTracksHTML,
        oldGDTracksHTML,
        dbQueryService: new LoadWikiHtmlQueryService(tx),
        trackRepository: new TrackRepository(tx),
      });
      await new WikiLoadingIssueRepository(tx).save(issues);
    },
    { timeout: 30000 },
  );

  return new Response();
}
