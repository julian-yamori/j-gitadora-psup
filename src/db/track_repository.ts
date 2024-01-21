import PrismaClient from "@prisma/client";
import { Track } from "@/domain/track/track";
import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "./prisma_client";

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
    await this.prismaTransaction.track.update({
      where: { id: track.id },
      data: {
        id: track.id,
        title: track.title,
        artist: track.artist,
        skillType: track.skillType,
        long: track.long,
        openType: track.openType,
        // 一旦削除して追加しなおす
        // todo 外部依存あるとダメかも
        scores: {
          deleteMany: {},
        },
      },
      include: { scores: true },
    });
    await this.prismaTransaction.score.createMany({
      data: Object.values(track.scores).map((d) => ({
        trackId: d.trackId,
        difficulty: d.difficulty,
        lv: d.lv,
      })),
    });
  }

  async delete(id: string) {
    // 論理削除
    await this.prismaTransaction.track.updateMany({
      where: { id },
      data: { deleted: true },
    });
  }
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
