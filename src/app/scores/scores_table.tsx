import { ScoreListDto } from "@/db/score_list/score_list_dto";
import { Difficulty, difficultyToStr } from "@/domain/track/difficulty";
import { skillTypeToStr } from "@/domain/track/skill_type";
import { lvToString } from "@/domain/track/track";
import {
  achievementToPercent,
  skillPointToDisplay,
} from "@/domain/track/user_track";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";

export default function ScoresTable({
  scores,
}: {
  scores: ReadonlyArray<ScoreListDto>;
}) {
  if (scores.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>曲名</TableCell>
            <TableCell>区分</TableCell>
            <TableCell>LONG</TableCell>
            <TableCell>難易度</TableCell>
            <TableCell>Lv</TableCell>
            <TableCell>好み</TableCell>
            <TableCell>達成率</TableCell>
            <TableCell>Skill Point</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={rowKey(score)}>
              <TableCell>
                <Link href={`/tracks/${score.trackId}`}>{score.title}</Link>
              </TableCell>
              <TableCell>{skillTypeToStr(score.skillType)}</TableCell>
              <TableCell>{score.long ? "LONG" : undefined}</TableCell>
              <TableCell>{difficultyToStr(score.difficulty)}</TableCell>
              <TableCell>{lvToString(score.lv)}</TableCell>
              <TableCell>{likeView(score.like)}</TableCell>
              <TableCell>{achievementView(score.achievement)}</TableCell>
              <TableCell>{skillPointView(score.skillPoint)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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

function likeView(like: number | undefined): string {
  if (like === undefined) return "";
  else return `★${like}`;
}

function achievementView(achievement: number | undefined): string {
  return `${achievementToPercent(achievement ?? 0)}%`;
}

function skillPointView(skillPoint: number | undefined): string {
  return skillPointToDisplay(skillPoint ?? 0);
}
