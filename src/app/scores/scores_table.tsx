import { ScoreListDto } from "@/db/score_list/score_list_dto";
import {
  OrderDirection,
  ScoreOrder,
  ScoreOrderTarget,
} from "@/domain/score_query/score_order";
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
  TableSortLabel,
} from "@mui/material";
import Link from "next/link";

export default function ScoresTable({
  scores,
  order,
  onOrderChange,
}: {
  scores: ReadonlyArray<ScoreListDto>;
  order: ScoreOrder | undefined;
  onOrderChange: (order: ScoreOrder) => unknown;
}) {
  if (scores.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <ScoreTableHeaderCell
              target="title"
              label="曲名"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="skillType"
              label="区分"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="long"
              label="LONG"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="difficulty"
              label="難易度"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="lv"
              label="Lv"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="like"
              label="好み"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="achievement"
              label="達成率"
              order={order}
              onChange={onOrderChange}
            />
            <ScoreTableHeaderCell
              target="skillPoint"
              label="Skill Point"
              order={order}
              onChange={onOrderChange}
            />
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

function ScoreTableHeaderCell({
  target,
  label,
  order,
  onChange,
}: {
  target: ScoreOrderTarget;
  label: string;
  order: ScoreOrder | undefined;
  onChange: (order: ScoreOrder) => unknown;
}) {
  const myOrder = order?.target === target ? order : undefined;

  const handleClick = () => {
    onChange({
      target,
      direction: newOrderDirection(myOrder?.direction),
    });
  };

  return (
    <TableCell sortDirection={myOrder?.direction}>
      <TableSortLabel
        active={myOrder !== undefined}
        direction={myOrder?.direction}
        onClick={handleClick}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}

function newOrderDirection(
  oldDirection: OrderDirection | undefined,
): OrderDirection {
  switch (oldDirection) {
    case "asc":
      return "desc";

    case "desc":
    case undefined:
      return "asc";
  }
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
