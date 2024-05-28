import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";
import formKeyByScore from "../../api/tracks/form_key";
import { ALL_DIFFICULTIES, Difficulty } from "../../../domain/track/difficulty";
import { Track, Score, lvToString } from "../../../domain/track/track";
import {
  UserTrack,
  UserScore,
  skillPointToDisplay,
  trackSkillPoint,
  initialUserScore,
} from "../../../domain/track/user_track";
import AchievementInput from "./achievement_input";
import { DifficultyPaper } from "../../../components/track_info/type_papers";

/** 曲詳細画面の、譜面毎のテーブル */
export default function ScoresTable({
  track,
  userTrack,
  onScoreChange,
  onAchievementValidChange,
}: {
  track: Track;
  userTrack: UserTrack;
  onScoreChange: (d: UserScore) => unknown;
  onAchievementValidChange: (d: Difficulty, valid: boolean) => unknown;
}) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>難易度</TableCell>
            <TableCell align="right">LV</TableCell>
            <TableCell>達成率</TableCell>
            <TableCell align="center">Failed</TableCell>
            <TableCell align="right">SP</TableCell>
            <TableCell>動画URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ALL_DIFFICULTIES.map((d) => {
            const td = track.scores[d];
            return td ? (
              <ScoreRowExist
                key={d}
                score={td}
                userScore={userTrack.scores[d]}
                onValueChange={onScoreChange}
                onAchievementValidChange={onAchievementValidChange}
              />
            ) : (
              <ScoreRowEmpty key={d} difficulty={d} />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ScoreRowEmpty({ difficulty }: { difficulty: Difficulty }) {
  return (
    <TableRow>
      <TableCell>
        <DifficultyPaper difficulty={difficulty} />
      </TableCell>
      <TableCell align="right">---</TableCell>
      <TableCell>---</TableCell>
      <TableCell align="center" />
      <TableCell align="right">---</TableCell>
      <TableCell>---</TableCell>
    </TableRow>
  );
}

function ScoreRowExist({
  score,
  userScore,
  onValueChange,
  onAchievementValidChange,
}: {
  score: Score;
  userScore: UserScore | undefined;
  onValueChange: (d: UserScore) => unknown;
  onAchievementValidChange: (d: Difficulty, valid: boolean) => unknown;
}) {
  // UserScore が未定義なら初期値で代替
  const nonNullUserScore = userScore ?? initialUserScore(score);

  return (
    <TableRow>
      <TableCell>
        <DifficultyPaper difficulty={score.difficulty} />
      </TableCell>
      <TableCell align="right">{lvToString(score.lv)}</TableCell>
      <TableCell>
        <AchievementInput
          difficulty={score.difficulty}
          achievement={nonNullUserScore.achievement}
          failed={nonNullUserScore.failed}
          onValueChange={(v) =>
            onValueChange({ ...nonNullUserScore, achievement: v })
          }
          onValidChange={(v) => onAchievementValidChange(score.difficulty, v)}
        />
      </TableCell>
      <TableCell align="center">
        <FailedInput
          difficulty={score.difficulty}
          achievement={nonNullUserScore.achievement}
          failed={nonNullUserScore.failed}
          onChange={(v) => onValueChange({ ...nonNullUserScore, failed: v })}
        />
      </TableCell>
      <TableCell align="right">
        {skillPointToDisplay(
          trackSkillPoint(score.lv, nonNullUserScore.achievement),
        )}
      </TableCell>
      <TableCell>
        <TextField
          type="url"
          name={formKeyByScore(score.difficulty, "movie_url")}
          value={nonNullUserScore.movieURL}
          onChange={(e) =>
            onValueChange({ ...nonNullUserScore, movieURL: e.target.value })
          }
          size="small"
          inputProps={{
            size: 43, // YoutubeのURLの長さ
          }}
        />
      </TableCell>
    </TableRow>
  );
}

function FailedInput({
  difficulty,
  achievement,
  failed,
  onChange,
}: {
  difficulty: Difficulty;
  achievement: number;
  failed: boolean;
  onChange: (value: boolean) => unknown;
}) {
  return (
    <Checkbox
      name={formKeyByScore(difficulty, "failed")}
      checked={failed}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
      disabled={achievement !== 0}
    />
  );
}
