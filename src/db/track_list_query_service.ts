import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "./prisma_client";
import { TrackListDto } from "./track_list_dto";

/** 曲一覧のDB参照機能 */
export default class TrackListQueryService {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  async allTracks(): Promise<TrackListDto[]> {
    return (
      await this.prismaTransaction.track.findMany({
        where: { deleted: false },
        include: { difficulties: { select: { difficulty: true, lv: true } } },
      })
    ).map((dbModel) => ({
      id: dbModel.id,
      title: dbModel.title,
      skillType: skillTypeFromNum(dbModel.skillType),
      long: dbModel.long,
      openType: openTypeFromNum(dbModel.openType),
      difficulties: dbModel.difficulties.map((d) => ({
        difficulty: difficultyFromNum(d.difficulty),
        lv: d.lv,
      })),
    }));
  }
}
