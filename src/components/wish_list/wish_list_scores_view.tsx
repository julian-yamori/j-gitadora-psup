import { CircularProgress, Divider, Stack, Typography } from "@mui/material";
import {
  achievementToPercent,
  achievementToRank,
} from "../../domain/track/achievement";
import { AchievementRankView } from "../track_info/achievement_rank_view";
import Link from "next/link";
import {
  DifficultyPaper,
  LongPaper,
  SkillTypePaper,
} from "../track_info/type_papers";
import { lvToString } from "../../domain/track/track";
import { ScoreListDtoRow } from "../../db/score_list/score_list_dto";

/** ウィッシュリスト系画面用の曲リスト共通コンポーネント */
export default function WishListScoresView({
  scores,
}: {
  /**
   * 表示する曲リスト
   *
   * 読み込み中の場合は undefined
   */
  scores: ReadonlyArray<ScoreListDtoRow> | undefined;
}) {
  // 読み込み中の場合の表示
  if (scores === undefined) {
    return <CircularProgress />;
  }

  return (
    <Stack divider={<Divider />} spacing={1}>
      {scores.map((score) => (
        <ScoreView key={rowKey(score)} score={score}></ScoreView>
      ))}
    </Stack>
  );
}

function rowKey({
  trackId,
  difficulty,
}: {
  trackId: string;
  difficulty: Difficulty;
}): string {
  return `${trackId}_${difficulty}`;
}

function ScoreView({ score }: { score: ScoreListDtoRow }) {
  return (
    <Stack spacing={1}>
      <Link href={`/tracks/${score.trackId}`}>{score.title}</Link>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>{likeView(score.like)}</Typography>
        <SkillTypePaper skillType={score.skillType} />
        {score.long ? <LongPaper /> : undefined}
        <DifficultyPaper difficulty={score.difficulty} />
        <Typography>{`Lv : ${lvToString(score.lv)}`}</Typography>
      </Stack>

      <AchievementView achievement={score.achievement} />
    </Stack>
  );
}

function likeView(like: number | undefined): string {
  if (like === undefined) return "";
  else return `★${like}`;
}

function AchievementView({ achievement }: { achievement: number | undefined }) {
  const rank =
    achievement !== undefined ? achievementToRank(achievement) : undefined;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography>{achievementToPercent(achievement ?? 0)}%</Typography>
      <AchievementRankView rank={rank} />
    </Stack>
  );
}
