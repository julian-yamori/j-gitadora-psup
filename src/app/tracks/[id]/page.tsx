import { cache } from "react";
import { Stack, Typography } from "@mui/material";
import createMetadata from "../../_util/create_metadata";
import PageTitle from "../../../components/page_title";
import prismaClient from "../../../db/prisma_client";
import TrackRepository from "../../../db/track/track_repository";
import UserTrackRepository from "../../../db/track/user_track_repository";
import { INITIAL } from "../../../domain/track/open_type";
import { initialUserTrack } from "../../../domain/track/user_track";
import TrackForm from "./track_form";
import {
  EventPaper,
  LongPaper,
  SkillTypePaper,
} from "../../../components/track_info/type_papers";

export const dynamic = "force-dynamic";

// track を generateMetadata と Home で共有するためのキャッシュ
const getTrack = cache(async (id: string) => {
  const [track, userTrack] = await Promise.all([
    new TrackRepository(prismaClient).get(id),
    new UserTrackRepository(prismaClient).get(id),
  ]);

  if (track === undefined) {
    throw Error(`track not found: ${id}`);
  }

  return {
    track,
    userTrack: userTrack ?? initialUserTrack(track),
  };
});

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const { track } = await getTrack(params.id);
  return createMetadata(track.title);
}

/** 曲詳細ページ */
export default async function Home({ params }: Props) {
  const { track, userTrack } = await getTrack(params.id);

  return (
    <main>
      <PageTitle title={track.title} />

      <Typography>{track.artist}</Typography>

      <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
        <SkillTypePaper skillType={track.skillType} />
        {track.long ? <LongPaper /> : null}
        {track.openType !== INITIAL ? <EventPaper /> : null}
      </Stack>

      <TrackForm track={track} initialUserTrack={userTrack} />
    </main>
  );
}
