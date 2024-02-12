/* eslint-disable no-await-in-loop -- updatedTrackIds の処理は手続き的な for ループの方が読みやすそうなので、一旦これで…… */

import TrackRepository from "@/db/track/track_repository";
import { RegisterIssueDto } from "@/db/wiki_loading/register_query_service";
import neverError from "@/utils/never_error";

/**
 * wikiから読み込みの、一旦保存した問題点からの登録を実行
 * @param issues 発生していた問題点リスト
 * @returns 更新した曲の ID のリスト
 */
export default async function registerFromIssues(
  issues: ReadonlyArray<RegisterIssueDto>,
  trackRepository: TrackRepository,
): Promise<string[]> {
  const updatedTrackIds: string[] = [];

  for (const issue of issues) {
    const { type } = issue;
    switch (type) {
      case "new":
        await trackRepository.create(issue.newTrack);
        break;
      case "diff":
        await trackRepository.update(issue.newTrack);
        updatedTrackIds.push(issue.newTrack.id);
        break;
      case "delete":
        await trackRepository.delete(issue.trackId);
        break;

      default:
        throw neverError(type);
    }
  }

  return updatedTrackIds;
}
