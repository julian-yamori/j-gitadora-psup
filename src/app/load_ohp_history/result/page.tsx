import { Box, Card } from "@mui/material";
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
import { difficultyToStr } from "../../../domain/track/difficulty";
import { achievementToPercent } from "../../../domain/track/user_track";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "プレイ履歴の取得完了";
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
      {results.map((result) => (
        <ResultCard key={result.index} result={result} />
      ))}
    </main>
  );
}

function FailedPage() {
  return <main>プレイ履歴の取得に失敗しました。</main>;
}

function ResultCard({ result }: { result: LoadOhpHistoryResult }) {
  const { type } = result;
  switch (type) {
    case "success":
      return <SuccessCard result={result} />;
    case "error":
      return <FailedCard result={result} />;
    default:
      throw neverError(type);
  }
}

function SuccessCard({ result }: { result: LoadOhpHistorySuccess }) {
  const {
    trackId,
    title,
    difficulty,
    submitAchievement,
    oldAchievement,
    newAchievement,
  } = result;

  return (
    <Card>
      <Link href={`/trucks/${trackId}`}>{title}</Link>
      <Box>{difficultyToStr(difficulty)}</Box>
      <AchievementView
        submitAchievement={submitAchievement}
        oldAchievement={oldAchievement}
        newAchievement={newAchievement}
      />
    </Card>
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
  const oldView =
    oldAchievement !== undefined ? achievementToPercent(oldAchievement) : "--";
  const newView = achievementToPercent(newAchievement);

  return `${oldView}% -> ${newView}% Updated!`;
}

function AchievementViewNoChanged({
  submitAchievement,
  newAchievement,
}: {
  submitAchievement: number;
  newAchievement: number;
}) {
  const submitView = achievementToPercent(submitAchievement);
  const newView = achievementToPercent(newAchievement);

  return `${submitView}% (前回: ${newView}%)`;
}

function FailedCard({ result }: { result: LoadOhpHistoryError }) {
  return <Card>{result.message}</Card>;
}
