import { skillTypeFromNum } from "@/domain/track/skill_type";
import { openTypeFromNum } from "@/domain/track/open_type";
import { difficultyFromNum } from "@/domain/track/difficulty";
import PrismaClient from "@prisma/client";
import { PrismaTransaction } from "../prisma_client";
import { TrackListDto } from "./track_list_dto";

export async function queryAllTracks(
  tx: PrismaTransaction,
): Promise<TrackListDto[]> {
  return (
    await tx.track.findMany({
      where: { deleted: false },
      include: { scores: { select: { difficulty: true, lv: true } } },
    })
  ).map(dbModelToDto);
}

export async function searchTracksByTitle(
  tx: PrismaTransaction,
  titleQuery: string,
): Promise<TrackListDto[]> {
  return (
    await tx.track.findMany({
      where: {
        deleted: false,
        title: { contains: titleQuery, mode: "insensitive" },
      },
      include: { scores: { select: { difficulty: true, lv: true } } },
    })
  ).map(dbModelToDto);
}

type DbTrack = PrismaClient.Track & {
  scores: Omit<PrismaClient.Score, "trackId">[];
};

function dbModelToDto(dbModel: DbTrack): TrackListDto {
  return {
    id: dbModel.id,
    title: dbModel.title,
    skillType: skillTypeFromNum(dbModel.skillType),
    long: dbModel.long,
    openType: openTypeFromNum(dbModel.openType),
    scores: dbModel.scores.map((d) => ({
      difficulty: difficultyFromNum(d.difficulty),
      lv: d.lv,
    })),
  };
}
