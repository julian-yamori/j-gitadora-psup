import PrismaClient from "@prisma/client";
import {
  WikiLoadingIssueDelete,
  WikiLoadingIssueDiffirence,
  WikiLoadingIssueNew,
} from "@/domain/wiki_loading/wiki_loading_issue";
import { Track } from "@/domain/track/track";
import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";

/** wikiから読み込み機能の、画面上チェック用の、問題点1つのDTO */
export type RegisterIssueDto =
  | Pick<WikiLoadingIssueNew, "type" | "newTrack">
  | Pick<WikiLoadingIssueDiffirence, "type" | "newTrack">
  | WikiLoadingIssueDelete;

/** wikiから読み込み機能の、登録実行のためのDB参照機能 */
export default class RegisterQueryService {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  /**
   * 問題点リストを取得
   */
  async issues(): Promise<RegisterIssueDto[]> {
    const found = await this.prismaTransaction.wikiLoadingIssue.findMany({
      include: {
        track: {
          include: { difficulties: true },
        },
      },
    });

    return found.map(({ id, type, track, errorMessage }): RegisterIssueDto => {
      switch (type) {
        case "new":
        case "diff":
          if (track === null) {
            throw Error(`track not found: issue id ${id}`);
          }

          return {
            type,
            newTrack: trackPrisma2Domain(track),
          };

        case "delete":
          return {
            type,
            trackId: id,
          };

        case "error":
          throw Error(`error remains: issue id ${id} : ${errorMessage ?? ""}`);

        default:
          throw Error(`unknown issue type: ${type}`);
      }
    });
  }
}

/** PrismaのWikiLoadingNewTrackからドメインモデルのTrackに変換 */
function trackPrisma2Domain(
  dto: PrismaClient.WikiLoadingNewTrack & {
    difficulties: PrismaClient.TrackByDifficulty[];
  },
): Track {
  const difficulties = Object.fromEntries(
    dto.difficulties.map((v) => [difficultyFromNum(v.difficulty), v]),
  );

  return {
    id: dto.id,
    title: dto.title,
    skillType: skillTypeFromNum(dto.skillType),
    long: dto.long,
    openType: openTypeFromNum(dto.openType),
    difficulties,
  };
}
