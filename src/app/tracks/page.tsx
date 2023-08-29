import prismaClient from "@/db/prisma_client";
import TracksQueryService from "@/db/tracks_query_service";
import { difficultyToStr } from "@/domain/track/difficulty";
import { openTypeToStr } from "@/domain/track/open_type";
import { skillTypeToStr } from "@/domain/track/skill_type";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "曲リスト",
};

/** 曲リストページ */
export default async function Home() {
  const tracksQueryService = new TracksQueryService(prismaClient);
  const tracks = await tracksQueryService.allTracks();

  return tracks.map((track) => (
    <>
      <h1>{track.title}</h1>
      <ul>
        <li>{skillTypeToStr(track.skillType)}</li>
        <li>
          {track.difficulties.map(
            (d) => `${difficultyToStr(d.difficulty)}: ${d.lv.toFixed(2)}, `,
          )}
        </li>
        {track.long ? <li>long</li> : undefined}
        <li>{openTypeToStr(track.openType)}</li>
      </ul>
    </>
  ));
}
