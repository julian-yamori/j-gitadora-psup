import { parse, HTMLElement } from "node-html-parser";
import { TrackByDifficulty } from "@prisma/client";
import { Track } from "@/domain/track/track";
import { HOT } from "@/domain/track/skill_type";
import {
  OpenType,
  INITIAL,
  EVENT,
  ENCORE,
  PREMIUM_ENCORE,
} from "@/domain/track/open_type";
import { ALL_DIFFICULTIES, Difficulty } from "@/domain/track/difficulty";
import { WikiLoadingSource } from "./wiki_loading_source";
import { WikiLoadingIssueError } from "./wiki_loading_issue";

// 想定している列数
const NEW_COL_COUNT = 17;
const NEW_COL_COUNT_STR = NEW_COL_COUNT.toString();

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

/** 「新曲リスト」ページのHTMLを解析 */
// eslint-disable-next-line import/prefer-default-export -- todo 他のページの解析関数もすぐ作る
export function parseNewTrackHTML(
  html: string,
): Array<ParsedTrack | WikiLoadingIssueError> {
  const root = parse(html);
  const rows = root.querySelectorAll("tbody tr");

  if (rows.length === 0) return [errorNoRows("new")];

  return [...rows.entries()]
    .map(([i, r]) => parseNewRow(i, r))
    .filter((i) => i !== undefined) as Array<
    ParsedTrack | WikiLoadingIssueError
  >;
}

/**
 * 「新曲リスト」ページのテーブル行を解析
 * @param rowNo テーブル行の行番号
 * @param tr テーブル行の<tr>のHTMLElement
 * @returns
 * 正常に曲データを読み込めた場合はTrack。
 * 読み込めなかった場合はWikiLoadingIssueError。
 * 無視していい行であればundefined。
 */
function parseNewRow(
  rowNo: number,
  tr: HTMLElement,
): ParsedTrack | WikiLoadingIssueError | undefined {
  const SOURCE = "new";

  const cells = tr.getElementsByTagName("td");

  // 見出しの連結行は無視
  if (
    cells.length === 1 &&
    cells[0].getAttribute("colspan") === NEW_COL_COUNT_STR
  ) {
    return undefined;
  }

  if (cells.length !== NEW_COL_COUNT) {
    return errorInvalidColumnCount(SOURCE, rowNo);
  }

  const bunruiResult = convertBunruiNew(cells[0]);
  if (typeof bunruiResult === "string") {
    return { type: "error", source: SOURCE, rowNo, message: bunruiResult };
  }

  const title = getTdText(cells[1]);
  if (title === undefined) {
    return {
      type: "error",
      source: SOURCE,
      rowNo,
      message: ERROR_MSG_EMPTY_TITLE,
    };
  }

  const difficulties = parseDifficultiesFromCell(cells.slice(5, 9));
  if (typeof difficulties === "string") {
    return { type: "error", source: SOURCE, rowNo, message: difficulties };
  }

  return {
    ...bunruiResult,
    title,
    skillType: HOT,
    difficulties,
    source: SOURCE,
    rowNo,
  };
}

/** 「新曲リスト」ページの「分類」列を変換 */
// todo エラーの場合はとりあえずstringでメッセージを返すようにしてるけど、Result型の方が合いそう
function convertBunruiNew(
  bunruiCell: HTMLElement,
): { openType: OpenType; long: boolean } | string {
  const openTypes: OpenType[] = [];
  const longs: boolean[] = [];

  for (const text of parseBunruiCell(bunruiCell)) {
    const enMatch = text.match(/^EN(\d+)$/);
    if (enMatch) {
      openTypes.push(ENCORE);
    } else if (text.match(/^PE\d+$/)) {
      openTypes.push(PREMIUM_ENCORE);
    } else {
      switch (text) {
        case "版":
          break;
        case "SEC":
        case "10":
        case "20":
          openTypes.push(EVENT);
          break;
        case "L":
          longs.push(true);
          break;
        default:
          return errorMsgUnknownBunrui(text);
      }
    }
  }

  if (openTypes.length > 1) {
    return `OpenTypeが複数指定されました : ${openTypes.join(",")}`;
  }
  if (longs.length > 1) {
    return `longが複数指定されました : ${longs.join(",")}`;
  }

  return {
    openType: openTypes.at(0) ?? INITIAL,
    long: longs.at(0) ?? false,
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
 * 分類セルをまず構文解析
 * @param cell 分類の<td>
 * @returns タグで区切られたテキストの配列
 */
function parseBunruiCell(cell: HTMLElement): string[] {
  const result: string[] = [];

  // <br>区切りで複数あることがあるので分解
  for (const child of cell.childNodes) {
    // Node.TEXT_NODE
    if (child.nodeType === 3) {
      if (child.text !== null) {
        const trimed = child.text.trim();
        if (trimed.length > 0) {
          result.push(trimed);
        }
      }
    }
  }

  return result;
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

/** 分類列が不明な場合のエラーメッセージを作成 */
function errorMsgUnknownBunrui(bunruiText: string) {
  return `不明な分類です : ${bunruiText}`;
}

const ERROR_MSG_EMPTY_TITLE = "曲名が空です";
