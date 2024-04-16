import { loadSkillRangeScores } from "../../db/skill_range_score/load_skill_range_scores";
import prismaClient from "../../db/prisma_client";
import createMetadata from "../_util/create_metadata";
import PageTitle from "../../components/page_title";
import ViewBySkillType from "./view_by_skill_type";
import { HOT, OTHER } from "../../domain/track/skill_type";
import { Paper, Stack, Typography } from "@mui/material";
import { sumSkillPoint } from "../../db/skill_range_score/skill_range_score";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "スキル対象曲";
export const metadata = createMetadata(PAGE_TITLE);

/** スキル対象曲ページ */
export default async function Home() {
  const list = await loadSkillRangeScores(prismaClient, 50);

  return (
    <main>
      <Stack spacing={2} alignItems="flex-start">
        <PageTitle title={PAGE_TITLE} />

        <SumView sum={sumSkillPoint(list)} />
        <ViewBySkillType skillType={HOT} scores={list[HOT]} />
        <ViewBySkillType skillType={OTHER} scores={list[OTHER]} />
      </Stack>
    </main>
  );
}

function SumView({ sum }: { sum: number }) {
  return (
    <Paper sx={{ padding: 2 }}>
      <Typography fontSize="2rem">{sum.toFixed(2)} pts</Typography>
    </Paper>
  );
}
