import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import { PrismaTransaction } from "../prisma_client";
import { TrackListDto } from "./track_list_dto";

// eslint-disable-next-line import/prefer-default-export -- じきに関数を追加予定
export async function queryAllTracks(
  tx: PrismaTransaction,
): Promise<TrackListDto[]> {
  return (
    await tx.track.findMany({
      where: { deleted: false },
      include: { scores: { select: { difficulty: true, lv: true } } },
    })
  ).map((dbModel) => ({
    id: dbModel.id,
    title: dbModel.title,
    skillType: skillTypeFromNum(dbModel.skillType),
    long: dbModel.long,
    openType: openTypeFromNum(dbModel.openType),
    scores: dbModel.scores.map((d) => ({
      difficulty: difficultyFromNum(d.difficulty),
      lv: d.lv,
    })),
  }));
}
