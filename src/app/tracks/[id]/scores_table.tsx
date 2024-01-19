import formKeyByScore from "@/app/api/tracks/form_key";
import {
  ALL_DIFFICULTIES,
  Difficulty,
  difficultyToStr,
} from "@/domain/track/difficulty";
import { Track, Score, lvToString } from "@/domain/track/track";
import {
  TrackUserData,
  UserScore,
  skillPointToDisplay,
  trackSkillPoint,
} from "@/domain/track/track_user_data";
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
import AchievementInput from "./achievement_input";

/** 曲詳細画面の、譜面毎のテーブル */
export default function ScoresTable({
  track,
  trackUser,
  onScoreChange,
  onAchievementValidChange,
}: {
  track: Track;
  trackUser: TrackUserData;
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
                userScore={trackUser.scores[d]}
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
      <TableCell>{difficultyToStr(difficulty)}</TableCell>
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
  if (userScore === undefined) {
    throw Error(`user difficulty not found: ${score.difficulty}`);
  }

  return (
    <TableRow>
      <TableCell>{difficultyToStr(score.difficulty)}</TableCell>
      <TableCell align="right">{lvToString(score.lv)}</TableCell>
      <TableCell>
        <AchievementInput
          difficulty={score.difficulty}
          achievement={userScore.achievement}
          failed={userScore.failed}
          onValueChange={(v) => onValueChange({ ...userScore, achievement: v })}
          onValidChange={(v) => onAchievementValidChange(score.difficulty, v)}
        />
      </TableCell>
      <TableCell align="center">
        <FailedInput
          difficulty={score.difficulty}
          achievement={userScore.achievement}
          failed={userScore.failed}
          onChange={(v) => onValueChange({ ...userScore, failed: v })}
        />
      </TableCell>
      <TableCell align="right">
        {skillPointToDisplay(trackSkillPoint(score.lv, userScore.achievement))}
      </TableCell>
      <TableCell>
        <TextField
          name={formKeyByScore(score.difficulty, "movie_url")}
          value={userScore.movieURL}
          onChange={(e) =>
            onValueChange({ ...userScore, movieURL: e.target.value })
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
