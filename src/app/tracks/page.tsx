import PageTitle from "../../components/page_title";
import prismaClient from "../../db/prisma_client";
import { TrackListDto } from "../../db/track_list/track_list_dto";
import { searchTracksByTitle } from "../../db/track_list/track_list_query_service";
import TracksTable from "./tracks_table";
import createMetadata from "../_util/create_metadata";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "曲を検索";
export const metadata = createMetadata(PAGE_TITLE);

type SearchParamValue = string | string[] | undefined;

/** 曲を検索ページ */
export default async function Home({
  searchParams,
}: {
  searchParams: { query: SearchParamValue };
}) {
  const queryStr = queryToString(searchParams.query);
  const tracks = await searchTracks(queryStr);

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      {tracks.length > 0 ? (
        <TracksTable tracks={tracks} />
      ) : (
        `曲が見つかりませんでした: ${queryStr ?? ""}`
      )}
    </main>
  );
}

function queryToString(query: SearchParamValue): string | undefined {
  if (Array.isArray(query)) {
    return query.at(-1);
  }
  return query;
}

async function searchTracks(
  query: string | undefined,
): Promise<TrackListDto[]> {
  if (query === undefined || query === "") {
    return [];
  }

  return searchTracksByTitle(prismaClient, query);
}
