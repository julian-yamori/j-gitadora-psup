import createMetadata from "@/app/_util/create_metadata";
import PageTitle from "@/components/page_title";
import prismaClient from "@/db/prisma_client";
import TrackRepository from "@/db/track_repository";
import TrackUserRepository from "@/db/track_user_repository";
import { INITIAL } from "@/domain/track/open_type";
import { initialTrackUserData } from "@/domain/track/track_user_data";
import {
  HOT,
  OTHER,
  SkillType,
  skillTypeToStr,
} from "@/domain/track/skill_type";
import { cache } from "react";
import { Paper } from "@mui/material";
import TrackForm from "./track_form";

export const dynamic = "force-dynamic";

// track を generateMetadata と Home で共有するためのキャッシュ
const getTrack = cache(async (id: string) => {
  const [track, trackUser] = await Promise.all([
    new TrackRepository(prismaClient).get(id),
    new TrackUserRepository(prismaClient).get(id),
  ]);

  if (track === undefined) {
    throw Error(`track not found: ${id}`);
  }

  return {
    track,
    trackUser: trackUser ?? initialTrackUserData(track),
  };
});

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const { track } = await getTrack(params.id);
  return createMetadata(track.title);
}

/** 曲詳細ページ */
export default async function Home({ params }: Props) {
  const { track, trackUser } = await getTrack(params.id);

  return (
    <main>
      <PageTitle title={track.title} />

      <SkillTypePaper skillType={track.skillType} />
      {track.long ? (
        <TagPaper text="LONG" bgcolor="f4f" textColor="#fff" />
      ) : null}
      {track.openType !== INITIAL ? (
        <TagPaper text="EVENT" bgcolor="afa" textColor="#000" />
      ) : null}

      <TrackForm track={track} initialTrackUser={trackUser} />
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
  return <Paper sx={{ color: textColor, bgcolor }}>{text}</Paper>;
}

function SkillTypePaper({ skillType }: { skillType: SkillType }) {
  const text = skillTypeToStr(skillType);
  switch (skillType) {
    case HOT:
      return <TagPaper text={text} bgcolor="#d44" textColor="#fff" />;
    case OTHER:
      return <TagPaper text={text} bgcolor="#aaf" textColor="#000" />;
  }
}
