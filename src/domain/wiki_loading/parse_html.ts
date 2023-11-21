import { parse, HTMLElement } from "node-html-parser";
import { TrackByDifficulty } from "@prisma/client";
import { Track } from "@/domain/track/track";
import { HOT } from "@/domain/track/skill_type";
import { ALL_DIFFICULTIES, Difficulty } from "@/domain/track/difficulty";
import { WikiLoadingSource } from "./wiki_loading_source";
import { WikiLoadingIssueError } from "./wiki_loading_issue";
import convertBunrui from "./convert_bunrui";
import splitRowspan from "./split_rowspan";

// 想定している列数
const COL_COUNT = 17;
const COL_COUNT_STR = COL_COUNT.toString();

export type ParsedTrack = Omit<Track, "id" | "difficulties"> & {
  difficulties: Readonly<ParsedDifficulties>;

  /** HTMLの取得元 */
  source: WikiLoadingSource;
  /** テーブル行の番号 */
  rowNo: number;
};
export type ParsedDifficulty = Omit<TrackByDifficulty, "trackId">;
type ParsedDifficulties = {
  [K in Difficulty]?: ParsedDifficulty;
};

/** 曲リストのHTMLを解析 */
export function parseHTML(
  source: WikiLoadingSource,
  html: string,
): Array<ParsedTrack | WikiLoadingIssueError> {
  const root = parse(html);
  const tableCells = splitRowspan(root);

  if (tableCells.length === 0) return [errorNoRows(source)];

  const results: Array<ParsedTrack | WikiLoadingIssueError> = [];

  for (const [i, r] of tableCells.entries()) {
    const result = parseRow(source, i, r);
    switch (result.type) {
      case "track":
        results.push(result.track);
        break;

      case "error":
        results.push(result.error);
        break;

      case "ignore":
        break;
    }
  }

  return results;
}

/** parseRow()の結果 */
type ParseRowResult =
  | ParseRowResultTrack
  | ParseRowResultError
  | ParseRowResultIgnore;

/** parseRow()の結果 : 行の曲データ */
type ParseRowResultTrack = {
  type: "track";

  /** 曲データ */
  track: ParsedTrack;
};

/** parseRow()の結果 : エラー */
type ParseRowResultError = {
  type: "error";
  error: WikiLoadingIssueError;
};

/** parseRow()の結果 : 無視していい行 */
type ParseRowResultIgnore = {
  type: "ignore";
};

/**
 * テーブル行を解析
 * @param source HTMLの取得元ページの識別子
 * @param rowNo テーブル行の行番号
 * @param cells テーブル行の<td>のHTMLElementの配列
 * @returns 行の解析結果
 */
function parseRow(
  source: WikiLoadingSource,
  rowNo: number,
  cells: ReadonlyArray<HTMLElement>,
): ParseRowResult {
  // 見出しの連結行は無視
  if (
    cells.length === 1 &&
    cells[0].getAttribute("colspan") === COL_COUNT_STR
  ) {
    return { type: "ignore" };
  }

  if (cells.length !== COL_COUNT) {
    return { type: "error", error: errorInvalidColumnCount(source, rowNo) };
  }

  const bunruiResult = convertBunrui(cells[0]);
  if (typeof bunruiResult === "string") {
    return {
      type: "error",
      error: { type: "error", source, rowNo, message: bunruiResult },
    };
  }

  const title = getTdText(cells[1]);
  if (title === undefined) {
    return {
      type: "error",
      error: {
        type: "error",
        source,
        rowNo,
        message: ERROR_MSG_EMPTY_TITLE,
      },
    };
  }

  const difficulties = parseDifficultiesFromCell(cells.slice(5, 9));
  if (typeof difficulties === "string") {
    return {
      type: "error",
      error: { type: "error", source, rowNo, message: difficulties },
    };
  }

  return {
    type: "track",
    track: {
      ...bunruiResult,
      title,
      skillType: HOT,
      difficulties,
      source,
      rowNo,
    },
  };
}

/** Lv表記の4つのCellをTrackByDifficultyに変換 */
// todo エラーの場合はとりあえずstringでメッセージを返すようにしてるけど、Result型の方が合いそう
function parseDifficultiesFromCell(
  cells: ReadonlyArray<HTMLElement>,
): ParsedDifficulties | string {
  const results: ParsedDifficulties = {};

  for (const [i, difficulty] of ALL_DIFFICULTIES.entries()) {
    const cell = cells.at(i);
    if (cell === undefined) return "難易度の値が不正です";

    const text = getTdText(cell);
    if (text === undefined) return "難易度の値が不正です";
    if (text === "-") continue;

    const num = Number(text);
    if (Number.isNaN(num)) return "難易度の値が不正です";

    results[difficulty] = { difficulty, lv: num };
  }

  return results;
}

/**
 * <td>からテキストを取得
 * @param element <td>のHTMLElement
 * @returns innerText。空文字列の場合はundefined
 */
function getTdText(element: HTMLElement): string | undefined {
  const text = element.innerText;
  if (text === "") return undefined;
  return text;
}

/** 曲データに該当するテーブル行が一つも見つからなかったときのエラーを作成 */
function errorNoRows(source: WikiLoadingSource): WikiLoadingIssueError {
  return {
    type: "error",
    source,
    rowNo: undefined,
    message: "曲データがありません",
  };
}

/** テーブル行の列数が不正だったときのエラーを作成 */
function errorInvalidColumnCount(
  source: WikiLoadingSource,
  rowNo: number,
): WikiLoadingIssueError {
  return {
    type: "error",
    source,
    rowNo,
    message: "列の数が不正です",
  };
}

const ERROR_MSG_EMPTY_TITLE = "曲名が空です";
