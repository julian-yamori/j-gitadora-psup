import prismaClient from "@/db/prisma_client";
import TrackListQueryService from "@/db/track_list_query_service";
import { Typography } from "@mui/material";
import TracksTable from "./tracks_table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "曲リスト",
};

/** 曲リストページ */
export default async function Home() {
  const tracksQueryService = new TrackListQueryService(prismaClient);
  const tracks = await tracksQueryService.allTracks();

  return (
    <main>
      <Typography variant="h4">曲リスト</Typography>
      <TracksTable tracks={tracks} />
    </main>
  );
}
