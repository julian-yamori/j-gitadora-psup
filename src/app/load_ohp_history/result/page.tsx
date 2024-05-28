import { Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import createMetadata from "../../_util/create_metadata";
import {
  LoadOhpHistoryError,
  LoadOhpHistoryResult,
  LoadOhpHistorySuccess,
  loadResults,
} from "../../../db/load_ohp_history/load_result";
import neverError from "../../../utils/never_error";
import prismaClient from "../../../db/prisma_client";
import {
  achievementToPercent,
  achievementToRank,
} from "../../../domain/track/achievement";
import PageTitle from "../../../components/page_title";
import { DifficultyPaper } from "../../../components/track_info/type_papers";
import { AchievementRankView } from "../../../components/track_info/achievement_rank_view";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "プレイ履歴の取得結果";
export const metadata = createMetadata(PAGE_TITLE);

/** プレイ履歴の取得完了ページ */
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const success = searchParams.success ?? "0";

  if (success !== "1") {
    return <FailedPage />;
  }

  const results = await loadResults(prismaClient);

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />

      <Stack spacing={2}>
        {results.map((result) => (
          <Paper key={result.index} elevation={2} sx={{ padding: 1 }}>
            <ResultSwitch result={result} />
          </Paper>
        ))}
      </Stack>
    </main>
  );
}

function FailedPage() {
  return <main>プレイ履歴の取得に失敗しました。</main>;
}

function ResultSwitch({ result }: { result: LoadOhpHistoryResult }) {
  const { type } = result;
  switch (type) {
    case "success":
      return <SuccessContent result={result} />;
    case "error":
      return <FailedCotnent result={result} />;
    default:
      throw neverError(type);
  }
}

function SuccessContent({ result }: { result: LoadOhpHistorySuccess }) {
  const {
    trackId,
    title,
    difficulty,
    submitAchievement,
    oldAchievement,
    newAchievement,
  } = result;

  return (
    <>
      <Link href={`/tracks/${trackId}`}>{title}</Link>
      <DifficultyPaper difficulty={difficulty} />
      <AchievementView
        submitAchievement={submitAchievement}
        oldAchievement={oldAchievement}
        newAchievement={newAchievement}
      />
    </>
  );
}

function AchievementView({
  submitAchievement,
  oldAchievement,
  newAchievement,
}: {
  submitAchievement: number;
  oldAchievement: number | undefined;
  newAchievement: number;
}) {
  if (oldAchievement !== newAchievement) {
    return (
      <AchievementViewChanged
        oldAchievement={oldAchievement}
        newAchievement={newAchievement}
      />
    );
  } else {
    return (
      <AchievementViewNoChanged
        submitAchievement={submitAchievement}
        newAchievement={newAchievement}
      />
    );
  }
}

function AchievementViewChanged({
  oldAchievement,
  newAchievement,
}: {
  oldAchievement: number | undefined;
  newAchievement: number;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <AchievementValueView achievement={oldAchievement} />
      <Typography>{"->"}</Typography>
      <AchievementValueView achievement={newAchievement} />
      <Typography color="green"> Updated!</Typography>
    </Stack>
  );
}

function AchievementViewNoChanged({
  submitAchievement,
  newAchievement,
}: {
  submitAchievement: number;
  newAchievement: number;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <AchievementValueView achievement={submitAchievement} />
      <Typography>{"(前回:"}</Typography>
      <AchievementValueView achievement={newAchievement} />
      <Typography>{")"}</Typography>
    </Stack>
  );
}

function FailedCotnent({ result }: { result: LoadOhpHistoryError }) {
  return <Typography color="red">{result.message}</Typography>;
}

function AchievementValueView({
  achievement,
}: {
  achievement: number | undefined;
}) {
  if (achievement === undefined) {
    return "--%";
  }

  return (
    <>
      <Typography>{achievementToPercent(achievement ?? 0)}%</Typography>
      <AchievementRankView rank={achievementToRank(achievement)} />
    </>
  );
}
