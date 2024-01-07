import { parse, HTMLElement } from "node-html-parser";
import { HOT } from "@/domain/track/skill_type";
import { ALL_DIFFICULTIES, Difficulty } from "@/domain/track/difficulty";
import { Err, Ok, Result } from "@/utils/result";
import { WikiLoadingSource } from "./wiki_loading_source";
import { WikiLoadingIssueError } from "./wiki_loading_issue";
import convertBunrui from "./convert_bunrui";
import splitRowspan from "./split_rowspan";
import {
  ParsedDifficulties,
  ParsedDifficulty,
  ParsedTrack,
} from "./parsed_track";

// 想定している列数
const COL_COUNT = 17;
const COL_COUNT_STR = COL_COUNT.toString();

/** 曲リストのHTMLを解析 */
export default function parseHTML(
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
  if (bunruiResult.isErr()) {
    return {
      type: "error",
      error: { type: "error", source, rowNo, message: bunruiResult.error },
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

  const difficultiesR = parseDifficultiesFromCell(cells.slice(5, 9));
  if (difficultiesR.isErr()) {
    return {
      type: "error",
      error: { type: "error", source, rowNo, message: difficultiesR.error },
    };
  }

  return {
    type: "track",
    track: {
      ...bunruiResult.value,
      title,
      skillType: HOT,
      difficulties: difficultiesR.value,
      source,
      rowNo,
    },
  };
}

/** Lv表記の4つのCellをTrackByDifficultyに変換 */
function parseDifficultiesFromCell(
  cells: ReadonlyArray<HTMLElement>,
): Result<ParsedDifficulties, string> {
  function makeErr(): Err<ParsedDifficulties, string> {
    return new Err("難易度の値が不正です");
  }

  // mutable ParsedDifficulties
  const results: {
    [K in Difficulty]?: ParsedDifficulty;
  } = {};

  for (const [i, difficulty] of ALL_DIFFICULTIES.entries()) {
    const cell = cells.at(i);
    if (cell === undefined) return makeErr();

    const text = getTdText(cell);
    if (text === undefined) return makeErr();
    if (text === "-") continue;

    const num = Number(text);
    if (Number.isNaN(num)) return makeErr();

    results[difficulty] = { difficulty, lv: num };
  }

  return new Ok(results);
}

/**
 * <td>からテキストを取得
 * @param element <td>のHTMLElement
 * @returns <td>内のテキスト。空文字列の場合はundefined
 */
function getTdText(element: HTMLElement): string | undefined {
  const text = element.childNodes
    .map((node) => {
      if (node instanceof HTMLElement) {
        // 注釈を除去
        if (node.classList.contains("note_super")) return undefined;
        // それ以外のelementの場合は、とりあえず中身のテキストを返しておく (太赤字とかある)
        return node.innerText;
      }

      // Node.TEXT_NODE
      if (node.nodeType === 3) {
        return node.text;
      }

      return undefined;
    })
    .filter((s) => s !== undefined)
    .join("");

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
