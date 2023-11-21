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
      include: { difficulties: { select: { difficulty: true, lv: true } } },
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
        skillType: track.skillType,
        long: track.long,
        openType: track.openType,
        difficulties: {
          create: Object.values(track.difficulties).map((d) => ({
            difficulty: d.difficulty,
            lv: d.lv,
          })),
        },
        deleted: false,
      },
      include: { difficulties: true },
    });
  }

  async update(track: Track) {
    await this.prismaTransaction.track.update({
      where: { id: track.id },
      data: {
        id: track.id,
        title: track.title,
        skillType: track.skillType,
        long: track.long,
        openType: track.openType,
        // 一旦削除して追加しなおす
        // todo 外部依存あるとダメかも
        difficulties: {
          deleteMany: {},
        },
      },
      include: { difficulties: true },
    });
    await this.prismaTransaction.trackByDifficulty.createMany({
      data: Object.values(track.difficulties).map((d) => ({
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
    difficulties: Omit<PrismaClient.TrackByDifficulty, "trackId">[];
  },
): Track {
  if (dto.deleted) throw Error(`track ${dto.id} has been deleted`);

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
