import LoadWikiHtmlQueryService from "@/db/wiki_loading/load_wiki_html_query_service";
import TrackRepository from "@/db/track_repository";
import {
  TrackDiffirence,
  WikiLoadingIssue,
  WikiLoadingIssueDelete,
  WikiLoadingIssueError,
} from "./wiki_loading_issue";
import { ParsedTrack, parseNewTrackHTML } from "./parse_html";
import { Track, lvToString } from "../track/track";
import { skillTypeToStr } from "../track/skill_type";
import { openTypeToStr } from "../track/open_type";
import { ALL_DIFFICULTIES } from "../track/difficulty";

/**
 * wikiのHTMLから曲情報を読み込み
 * @param newTracksHTML 「新曲リスト」ページの曲テーブルのHTML
 */
export default async function loadWikiHTML({
  newTracksHTML,
  dbQueryService,
  trackRepository,
}: {
  newTracksHTML: string;
  dbQueryService: LoadWikiHtmlQueryService;
  trackRepository: TrackRepository;
}): Promise<WikiLoadingIssue[]> {
  // 既存の曲のMapを取得
  const existingTrackMap = await dbQueryService.existingTracks();

  // HTML解析
  const parsedRows = [...parseNewTrackHTML(newTracksHTML)];

  const issues: WikiLoadingIssue[] = [];

  // HTMLから取得した曲データをIssueに変換
  for (const row of parsedRows) {
    // eslint-disable-next-line no-await-in-loop -- DB読み込みは直列化したい
    const issue = await parsedRowToIssue(
      row,
      existingTrackMap,
      trackRepository,
    );
    if (issue !== undefined) {
      issues.push(issue);
    }
  }

  // 新規データに無い曲IDは削除予定とする
  issues.push(
    ...[...existingTrackMap.values()].map(
      (trackId): WikiLoadingIssueDelete => ({ type: "delete", trackId }),
    ),
  );

  return issues;
}

/**
 * HTMLテーブル1行の解析結果を、WikiLoadingIssueに変換
 * @param row 変換元の曲データ、もしくはエラー情報
 * @param existingTrackMap 既に存在している曲のMap (keyは曲名、valueはID)
 * @returns 変換されたIssue。特に問題がなければundefined
 */
async function parsedRowToIssue(
  row: ParsedTrack | WikiLoadingIssueError,
  existingTrackMap: Map<string, string>,
  trackRepository: TrackRepository,
): Promise<WikiLoadingIssue | undefined> {
  // typeがあればWikiLoadingIssueError型と判断する
  if ("type" in row) return row;

  const existingId = existingTrackMap.get(row.title);

  // 曲名が同じ曲がDBに無ければ、新規追加
  if (existingId === undefined) {
    return {
      type: "new",
      source: row.source,
      rowNo: row.rowNo,
      newTrack: addIdToParsedTrack(row, newTrackId()),
    };
  }

  existingTrackMap.delete(row.title);

  // 既存の曲データと比較
  const oldTrack = await trackRepository.get(existingId);
  if (oldTrack === undefined) throw Error(`Track not found : ${existingId}`);

  const diffirences = compareTrack(oldTrack, row);
  if (diffirences.length > 0) {
    return {
      type: "diff",
      source: row.source,
      rowNo: row.rowNo,
      newTrack: addIdToParsedTrack(row, existingId),
      diffirences,
    };
  }

  return undefined;
}

/** TrackNoIdに曲IDを付与 */
function addIdToParsedTrack(track: ParsedTrack, id: string): Track {
  return {
    ...track,
    id,
    difficulties: Object.fromEntries(
      Object.entries(track.difficulties).map(([k, d]) => [
        k,
        { ...d, trackId: id },
      ]),
    ),
  };
}

/** 曲のIDを新規作成 */
function newTrackId(): string {
  return crypto.randomUUID();
}

/** 既存の曲データと新規曲データを比較 */
function compareTrack(
  oldTrack: Track,
  newTrack: ParsedTrack,
): TrackDiffirence[] {
  const diffs: TrackDiffirence[] = [];

  if (oldTrack.title !== newTrack.title) {
    diffs.push({
      trackId: oldTrack.id,
      propertyName: "title",
      difficulty: undefined,
      oldValue: oldTrack.title,
      newValue: newTrack.title,
    });
  }

  if (oldTrack.skillType !== newTrack.skillType) {
    diffs.push({
      trackId: oldTrack.id,
      propertyName: "skillType",
      difficulty: undefined,
      oldValue: skillTypeToStr(oldTrack.skillType),
      newValue: skillTypeToStr(newTrack.skillType),
    });
  }

  if (oldTrack.long !== newTrack.long) {
    diffs.push({
      trackId: oldTrack.id,
      propertyName: "long",
      difficulty: undefined,
      oldValue: oldTrack.long.toString(),
      newValue: newTrack.long.toString(),
    });
  }

  if (oldTrack.openType !== newTrack.openType) {
    diffs.push({
      trackId: oldTrack.id,
      propertyName: "openType",
      difficulty: undefined,
      oldValue: openTypeToStr(oldTrack.openType),
      newValue: openTypeToStr(newTrack.openType),
    });
  }

  for (const difficulty of ALL_DIFFICULTIES) {
    const oldLv = oldTrack.difficulties[difficulty]?.lv;
    const newLv = newTrack.difficulties[difficulty]?.lv;

    if (oldLv !== newLv) {
      diffs.push({
        trackId: oldTrack.id,
        propertyName: "lv",
        difficulty,
        oldValue: oldLv !== undefined ? lvToString(oldLv) : "--",
        newValue: newLv !== undefined ? lvToString(newLv) : "--",
      });
    }
  }

  return diffs;
}
