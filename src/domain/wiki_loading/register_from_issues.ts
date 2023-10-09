/* eslint-disable no-await-in-loop -- DB操作は直列化したい */

import TrackRepository from "@/db/track_repository";
import { RegisterIssueDto } from "@/db/wiki_loading/register_query_service";

/**
 * wikiから読み込みの、一旦保存した問題点からの登録を実行
 * @param issues 発生していた問題点リスト
 */
export default async function registerFromIssues(
  issues: ReadonlyArray<RegisterIssueDto>,
  trackRepository: TrackRepository,
) {
  for (const issue of issues) {
    switch (issue.type) {
      case "new":
        await trackRepository.create(issue.newTrack);
        break;
      case "diff":
        await trackRepository.update(issue.newTrack);
        break;
      case "delete":
        await trackRepository.delete(issue.trackId);
        break;
    }
  }
}
