import createMetadata from "@/app/_util/create_metadata";
import PageTitle from "@/components/page_title";
import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track_repository";
import UserTrackRepository from "@/db/user_track_repository";
import { INITIAL } from "@/domain/track/open_type";
import { initialUserTrack } from "@/domain/track/user_track";
import {
  HOT,
  OTHER,
  SkillType,
  skillTypeToStr,
} from "@/domain/track/skill_type";
import { cache } from "react";
import { Paper, Stack } from "@mui/material";
import TrackForm from "./track_form";

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

      <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
        <SkillTypePaper skillType={track.skillType} />
        {track.long ? (
          <TagPaper text="LONG" bgcolor="f4f" textColor="#fff" />
        ) : null}
        {track.openType !== INITIAL ? (
          <TagPaper text="EVENT" bgcolor="afa" textColor="#000" />
        ) : null}
      </Stack>

      <TrackForm track={track} initialUserTrack={userTrack} />
    </main>
  );
}

function TagPaper({
  text,
  bgcolor,
  textColor,
}: {
  text: string;
  bgcolor: string;
  textColor: string;
}) {
  return (
    <Paper sx={{ color: textColor, bgcolor, padding: 0.8, fontWeight: "bold" }}>
      {text}
    </Paper>
  );
}

function SkillTypePaper({ skillType }: { skillType: SkillType }) {
  const text = skillTypeToStr(skillType);
  switch (skillType) {
    case HOT:
      return <TagPaper text={text} bgcolor="#e00000" textColor="#ffff00" />;
    case OTHER:
      return <TagPaper text={text} bgcolor="#00c000" textColor="#ff0" />;
  }
}
