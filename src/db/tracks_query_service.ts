import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "./prisma_client";
import { TracksDto } from "./tracks_dto";

/** 曲一覧のDB参照機能 */
export default class TracksQueryService {
  constructor(public readonly prismaTransaction: PrismaTransaction) {}

  async allTracks(): Promise<TracksDto[]> {
    return (
      await this.prismaTransaction.track.findMany({
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
