/* eslint-disable no-await-in-loop -- DBへのINSERT処理は直列化したい */

import PrismaClient from "@prisma/client";
import { WikiLoadingIssue } from "@/domain/wiki_loading/wiki_loading_issue";
import { Track } from "@/domain/track/track";
import { PrismaTransaction } from "../prisma_client";

/** Wikiからの曲情報の取り込み時問題のリポジトリ */
export default class WikiLoadingIssueRepository {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  async save(issues: ReadonlyArray<WikiLoadingIssue>) {
    // 情報まとめの前に、DB側で削除処理を開始しておく
    const deletePromise = this.deleteAll();

    // 一括登録のために一旦配列にまとめる
    const dbIssues: PrismaClient.WikiLoadingIssue[] = [];
    const dbNewTracks: PrismaClient.WikiLoadingNewTrack[] = [];
    const dbNewScores: PrismaClient.WikiLoadingNewScore[] = [];
    const dbDiffirences: PrismaClient.WikiLoadingDiffirence[] = [];

    for (const issue of issues) {
      switch (issue.type) {
        case "new": {
          dbIssues.push({
            id: issue.newTrack.id,
            type: issue.type,
            source: issue.source,
            rowNo: issue.rowNo,
            errorMessage: null,
          });
          const dbTrack = trackDomain2Prisma(issue.newTrack);
          dbNewTracks.push(dbTrack.track);
          dbNewScores.push(...dbTrack.scores);
          break;
        }

        case "diff": {
          const issueId = issue.newTrack.id;

          dbIssues.push({
            id: issueId,
            type: issue.type,
            source: issue.source,
            rowNo: issue.rowNo,
            errorMessage: null,
          });

          const dbTrack = trackDomain2Prisma(issue.newTrack);
          dbNewTracks.push(dbTrack.track);
          dbNewScores.push(...dbTrack.scores);

          dbDiffirences.push(
            ...issue.diffirences.map((diff) => ({
              id: createDiffirenceId(),
              issueId,
              propertyName: diff.propertyName,
              difficulty: diff.difficulty ?? null,
              oldValue: diff.oldValue ?? null,
              newValue: diff.newValue ?? null,
            })),
          );

          break;
        }

        case "delete": {
          dbIssues.push({
            id: issue.trackId,
            type: issue.type,
            source: null,
            rowNo: null,
            errorMessage: null,
          });
          break;
        }

        case "error": {
          dbIssues.push({
            id: createIssueId(),
            type: issue.type,
            source: issue.source,
            rowNo: issue.rowNo ?? null,
            errorMessage: issue.message,
          });
          break;
        }
      }
    }

    await deletePromise;

    await this.prismaTransaction.wikiLoadingIssue.createMany({
      data: dbIssues,
    });
    await this.prismaTransaction.wikiLoadingNewTrack.createMany({
      data: dbNewTracks,
    });
    await this.prismaTransaction.wikiLoadingNewScore.createMany({
      data: dbNewScores,
    });
    await this.prismaTransaction.wikiLoadingDiffirence.createMany({
      data: dbDiffirences,
    });
  }

  async deleteAll() {
    await this.prismaTransaction.wikiLoadingDiffirence.deleteMany();
    await this.prismaTransaction.wikiLoadingNewScore.deleteMany();
    await this.prismaTransaction.wikiLoadingNewTrack.deleteMany();
    await this.prismaTransaction.wikiLoadingIssue.deleteMany();
  }
}

function createIssueId(): string {
  return crypto.randomUUID();
}

function createDiffirenceId(): string {
  return crypto.randomUUID();
}

/** TrackのドメインモデルをPrismaのWikiLoadingNewTrackに変換 */
function trackDomain2Prisma(model: Track): {
  track: PrismaClient.WikiLoadingNewTrack;
  scores: PrismaClient.WikiLoadingNewScore[];
} {
  return {
    track: {
      id: model.id,
      title: model.title,
      artist: model.artist,
      skillType: model.skillType,
      long: model.long,
      openType: model.openType,
    },

    scores: Object.entries(model.scores).map(([, d]) => ({
      trackId: model.id,
      difficulty: d.difficulty,
      lv: d.lv,
    })),
  };
}
