import PrismaClient from "@prisma/client";
import {
  TrackAchievement,
  TrackUserData,
  TrackUserDataByDifficulty,
} from "@/domain/track/track_user_data";
import { Difficulty, difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "./prisma_client";

/** 曲のユーザー編集データのリポジトリ */
export default class TrackUserRepository {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  /** IDを指定して曲データを一つ取得 */
  async get(id: string): Promise<TrackUserData | undefined> {
    const found = await this.prismaTransaction.trackUser.findUnique({
      include: {
        difficulties: {
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
  async save(track: TrackUserData): Promise<void> {
    const fields = {
      like: track.like,
      isOpen: track.isOpen,
      memo: track.memo,
    };

    await this.prismaTransaction.trackUser.upsert({
      where: { id: track.id },
      create: {
        ...fields,
        id: track.id,
      },
      update: {
        ...fields,
        // 一旦削除して追加しなおす
        difficulties: { deleteMany: {} },
      },
    });

    await this.prismaTransaction.trackUserByDifficulty.createMany({
      data: Object.values(track.difficulties).map((d) => ({
        trackId: d.trackId,
        difficulty: d.difficulty,
        achievement: d.achievement === "failed" ? 0 : d.achievement,
        failed: d.achievement === "failed",
        skillPoint: d.skillPoint,
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
  dto: PrismaClient.TrackUser & {
    difficulties: Omit<PrismaClient.TrackUserByDifficulty, "trackId">[];
  },
): TrackUserData {
  const difficulties = Object.fromEntries(
    dto.difficulties.map((v): [Difficulty, TrackUserDataByDifficulty] => [
      difficultyFromNum(v.difficulty),
      {
        trackId: dto.id,
        difficulty: difficultyFromNum(v.difficulty),
        achievement: achievementPrisma2Domain(v.achievement, v.failed),
        skillPoint: v.skillPoint,
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
    difficulties,
  };
}

/** TrackAchievementをPrismaの値からドメインモデルに変換 */
function achievementPrisma2Domain(
  achievement: number,
  failed: boolean,
): TrackAchievement {
  if (failed && achievement === 0) return "failed";
  return achievement;
}
