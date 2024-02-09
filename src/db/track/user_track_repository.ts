import PrismaClient from "@prisma/client";
import { UserTrack, UserScore } from "@/domain/track/user_track";
import { Difficulty, difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";

/** 曲のユーザー編集データのリポジトリ */
export default class UserTrackRepository {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  /** IDを指定して曲データを一つ取得 */
  async get(id: string): Promise<UserTrack | undefined> {
    const found = await this.prismaTransaction.userTrack.findUnique({
      include: {
        scores: {
          select: {
            difficulty: true,
            achievement: true,
            failed: true,
            skillPoint: true,
            wishPractice: true,
            wishAchievement: true,
            wishEvent: true,
            wishNextPick: true,
            wishPlayed: true,
            movieURL: true,
          },
        },
      },
      where: { id },
    });

    if (found === null) return undefined;
    return trackPrisma2Domain(found);
  }

  /** 曲のユーザー編集データを保存 */
  async save(track: UserTrack): Promise<void> {
    const fields = {
      like: track.like ?? null,
      isOpen: track.isOpen,
      memo: track.memo,
    };

    await this.prismaTransaction.userTrack.upsert({
      where: { id: track.id },
      create: {
        ...fields,
        id: track.id,
      },
      update: {
        ...fields,
        // 一旦削除して追加しなおす
        scores: { deleteMany: {} },
      },
    });

    await this.prismaTransaction.userScore.createMany({
      data: Object.values(track.scores).map((d) => ({
        trackId: d.trackId,
        difficulty: d.difficulty,
        achievement: d.achievement,
        skillPoint: d.skillPoint,
        failed: d.failed,
        wishPractice: d.wishPractice,
        wishAchievement: d.wishAchievement,
        wishEvent: d.wishEvent,
        wishNextPick: d.wishNextPick,
        wishPlayed: d.wishPlayed,
        movieURL: d.movieURL,
      })),
    });
  }
}

/** PrismaのModelからドメインモデルに変換 */
function trackPrisma2Domain(
  dto: PrismaClient.UserTrack & {
    scores: Omit<PrismaClient.UserScore, "trackId">[];
  },
): UserTrack {
  const scores = Object.fromEntries(
    dto.scores.map((v): [Difficulty, UserScore] => [
      difficultyFromNum(v.difficulty),
      {
        trackId: dto.id,
        difficulty: difficultyFromNum(v.difficulty),
        achievement: v.achievement,
        skillPoint: v.skillPoint,
        failed: v.failed,
        wishPractice: v.wishPractice,
        wishAchievement: v.wishAchievement,
        wishEvent: v.wishEvent,
        wishNextPick: v.wishNextPick,
        wishPlayed: v.wishPlayed,
        movieURL: v.movieURL,
      },
    ]),
  );

  return {
    id: dto.id,
    like: dto.like === null ? undefined : dto.like,
    isOpen: dto.isOpen,
    memo: dto.memo,
    scores,
  };
}
