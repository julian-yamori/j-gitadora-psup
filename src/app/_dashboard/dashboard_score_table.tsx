import {
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  achievementToPercent,
  achievementToRank,
} from "../../domain/track/achievement";
import { AchievementRankView } from "../../components/track_info/achievement_rank_view";
import Link from "next/link";
import {
  DifficultyPaper,
  SkillTypePaper,
} from "../../components/track_info/type_papers";
import { lvToString } from "../../domain/track/track";
import { ScoreListDtoRow } from "../../db/score_list/score_list_dto";

/** ダッシュボード用の曲リスト共通コンポーネント */
export default function DashboardScoreTable({
  scores,
}: {
  /**
   * テーブルに表示する曲リスト
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
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <HeaderCell label="曲名" />
            <HeaderCell label="区分" />
            <HeaderCell label="LONG" />
            <HeaderCell label="難易度" />
            <HeaderCell label="Lv" />
            <HeaderCell label="好み" />
            <HeaderCell label="達成率" />
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={rowKey(score)}>
              <TableCell>
                <Link href={`/tracks/${score.trackId}`}>{score.title}</Link>
              </TableCell>
              <TableCell>
                <SkillTypePaper skillType={score.skillType} />
              </TableCell>
              <TableCell>{score.long ? "LONG" : undefined}</TableCell>
              <TableCell>
                <DifficultyPaper difficulty={score.difficulty} />
              </TableCell>
              <TableCell>{lvToString(score.lv)}</TableCell>
              <TableCell>{likeView(score.like)}</TableCell>
              <TableCell>
                <AchievementView achievement={score.achievement} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HeaderCell({ label }: { label: string }) {
  return <TableCell>{label}</TableCell>;
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

function likeView(like: number | undefined): string {
  if (like === undefined) return "";
  else return `★${like}`;
}

function AchievementView({ achievement }: { achievement: number | undefined }) {
  const rank =
    achievement !== undefined ? achievementToRank(achievement) : undefined;
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography>{achievementToPercent(achievement ?? 0)}%</Typography>
      <AchievementRankView rank={rank} />
    </Stack>
  );
}
