import PrismaClient from "@prisma/client";
import { Score, Track } from "@/domain/track/track";
import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import {
  ALL_DIFFICULTIES,
  Difficulty,
  difficultyFromNum,
} from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";

/** 曲データのリポジトリ */
export default class TrackRepository {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  /** IDを指定して曲データを一つ取得 */
  async get(id: string): Promise<Track | undefined> {
    const found = await this.prismaTransaction.track.findUnique({
      include: {
        scores: { select: { trackId: true, difficulty: true, lv: true } },
      },
      where: { id },
    });

    if (found === null) return undefined;
    return trackPrisma2Domain(found);
  }

  async create(track: Track) {
    await this.prismaTransaction.track.create({
      data: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        skillType: track.skillType,
        long: track.long,
        openType: track.openType,
        scores: {
          create: Object.values(track.scores).map((d) => ({
            difficulty: d.difficulty,
            lv: d.lv,
          })),
        },

        // UI 上からは編集せず、 DB を直接操作する想定
        sortTitle: null,

        deleted: false,
      },
      include: { scores: true },
    });
  }

  async update(track: Track) {
    // update Track
    await updateTrackRecord(this.prismaTransaction, track);

    // update Scores
    for (const difficulty of ALL_DIFFICULTIES) {
      const score = track.scores[difficulty];
      if (score !== undefined) {
        // eslint-disable-next-line no-await-in-loop -- DB操作は直列化した方がいいかも？
        await upsertScoreRecord(this.prismaTransaction, score);
      } else {
        // eslint-disable-next-line no-await-in-loop -- DB操作は直列化した方がいいかも？
        await deleteScoreRecord(this.prismaTransaction, track.id, difficulty);
      }
    }
  }

  async delete(id: string) {
    // 論理削除
    await this.prismaTransaction.track.updateMany({
      where: { id },
      data: { deleted: true },
    });
  }
}

async function updateTrackRecord(
  tx: PrismaTransaction,
  track: Track,
): Promise<void> {
  await tx.track.update({
    where: { id: track.id },
    data: {
      id: track.id,
      title: track.title,
      artist: track.artist,
      skillType: track.skillType,
      long: track.long,
      openType: track.openType,
    },
    include: { scores: true },
  });
}

async function upsertScoreRecord(
  tx: PrismaTransaction,
  score: Score,
): Promise<void> {
  await tx.score.upsert({
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Prisma では _ で指定する必要がある
      trackId_difficulty: {
        trackId: score.trackId,
        difficulty: score.difficulty,
      },
    },
    create: {
      trackId: score.trackId,
      difficulty: score.difficulty,
      lv: score.lv,
    },
    update: { lv: score.lv },
  });
}

async function deleteScoreRecord(
  tx: PrismaTransaction,
  trackId: string,
  difficulty: Difficulty,
): Promise<void> {
  await tx.score.delete({
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Prisma では _ で指定する必要がある
    where: { trackId_difficulty: { trackId, difficulty } },
  });
}

/** PrismaのModelからドメインモデルに変換 */
function trackPrisma2Domain(
  dto: PrismaClient.Track & {
    scores: PrismaClient.Score[];
  },
): Track {
  if (dto.deleted) throw Error(`track ${dto.id} has been deleted`);

  const scores = Object.fromEntries(
    dto.scores.map((v) => [difficultyFromNum(v.difficulty), v]),
  );

  return {
    id: dto.id,
    title: dto.title,
    artist: dto.artist,
    skillType: skillTypeFromNum(dto.skillType),
    long: dto.long,
    openType: openTypeFromNum(dto.openType),
    scores,
  };
}
