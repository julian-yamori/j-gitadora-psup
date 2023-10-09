import {
  WikiLoadingIssueDelete,
  WikiLoadingIssueDiffirence,
  WikiLoadingIssueError,
  WikiLoadingIssueNew,
} from "@/domain/wiki_loading/wiki_loading_issue";
import {
  WikiLoadingSource,
  validateWikiLoadingSource,
} from "@/domain/wiki_loading/wiki_loading_source";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";

/** wikiから読み込み機能の、画面上チェック用の、問題点1つのDTO */
export type CheckViewIssueDto =
  | CheckViewIssueDtoNew
  | CheckViewIssueDtoDiffirence
  | CheckViewIssueDtoDelete
  | CheckViewIssueDtoError;

export type CheckViewIssueDtoNew = Omit<WikiLoadingIssueNew, "newTrack"> & {
  /** 追加する曲の曲名 */
  title: string;
};

export type CheckViewIssueDtoDiffirence = Omit<
  WikiLoadingIssueDiffirence,
  "newTrack"
> & {
  /** 変更後の曲の曲名 */
  title: string;
};

export type CheckViewIssueDtoDelete = WikiLoadingIssueDelete & {
  /** 削除されるの曲の曲名 */
  title: string;
};

export type CheckViewIssueDtoError = WikiLoadingIssueError;

/** wikiから読み込み機能の、画面上チェックのためのDB参照機能 */
export default class CheckViewQueryService {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  /**
   * 問題点リストを取得
   */
  async issues(): Promise<CheckViewIssueDto[]> {
    const found = await this.prismaTransaction.wikiLoadingIssue.findMany({
      include: { diffirences: true, track: { select: { title: true } } },
    });

    const promises = found.map(
      async ({
        id,
        type,
        source,
        rowNo,
        track,
        diffirences,
        errorMessage,
      }): Promise<CheckViewIssueDto> => {
        switch (type) {
          case "new":
            if (track === null) {
              throw Error(`issue ${id}": track not found`);
            }

            return {
              type,
              source: validateSource(source, id),
              rowNo: validateRpwNoRequire(rowNo, id),
              title: track.title,
            };

          case "diff":
            if (track === null) {
              throw Error(`issue ${id}": track not found`);
            }

            return {
              type,
              diffirences: diffirences.map((d) => ({
                trackId: d.issueId,
                propertyName: d.propertyName,
                difficulty:
                  d.difficulty !== null
                    ? difficultyFromNum(d.difficulty)
                    : undefined,
                oldValue: d.oldValue ?? undefined,
                newValue: d.newValue ?? undefined,
              })),
              source: validateSource(source, id),
              rowNo: validateRpwNoRequire(rowNo, id),
              title: track.title,
            };

          case "delete":
            return {
              type,
              trackId: id,
              title: (
                await this.prismaTransaction.track.findUniqueOrThrow({
                  where: { id },
                  select: { title: true },
                })
              ).title,
            };

          case "error":
            if (errorMessage === null) {
              throw Error(`issue ${id}": errorMessage is null`);
            }
            return {
              type,
              source: validateSource(source, id),
              rowNo: rowNo ?? undefined,
              message: errorMessage,
            };

          default:
            throw Error(`unknown issue type: ${type}`);
        }
      },
    );
    return Promise.all(promises);
  }
}

/**
 * sourceのバリデーション
 * @param source WikiLoadingIssue.source
 * @param id WikiLoadingIssue.id (エラーメッセージ用)
 */
function validateSource(source: string | null, id: string): WikiLoadingSource {
  if (source === null) {
    throw Error(`issue ${id}": source is null`);
  }

  try {
    return validateWikiLoadingSource(source);
  } catch (e) {
    if (e instanceof Error) {
      throw Error(`issue ${id}": ${e.message}`);
    } else throw e;
  }
}

/**
 * rowNoのバリデーション (必須版)
 * @param rowNo WikiLoadingIssue.rowNo
 * @param id WikiLoadingIssue.id (エラーメッセージ用)
 */
function validateRpwNoRequire(rowNo: number | null, id: string): number {
  if (rowNo === null) {
    throw Error(`issue ${id}": rowNo is null`);
  }

  return rowNo;
}
