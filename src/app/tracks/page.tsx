import PageTitle from "@/components/page_title";
import prismaClient from "@/db/prisma_client";
import TrackListQueryService from "@/db/track_list/track_list_query_service";
import TracksTable from "./tracks_table";
import createMetadata from "../_util/create_metadata";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "曲リスト";
export const metadata = createMetadata(PAGE_TITLE);

/** 曲リストページ */
export default async function Home() {
  const tracksQueryService = new TrackListQueryService(prismaClient);
  const tracks = await tracksQueryService.allTracks();

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <TracksTable tracks={tracks} />
    </main>
  );
}
