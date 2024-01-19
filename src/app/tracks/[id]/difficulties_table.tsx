import {
  ALL_DIFFICULTIES,
  Difficulty,
  difficultyToStr,
} from "@/domain/track/difficulty";
import { Track, TrackByDifficulty, lvToString } from "@/domain/track/track";
import {
  TrackUserData,
  TrackUserDataByDifficulty,
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

/** 曲詳細画面の、難易度毎のテーブル */
export default function DifficultiesTable({
  track,
  trackUser,
  onDifficultyValueChange,
  onAchievementValidChange,
}: {
  track: Track;
  trackUser: TrackUserData;
  onDifficultyValueChange: (d: TrackUserDataByDifficulty) => unknown;
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
            const td = track.difficulties[d];
            return td ? (
              <DifficultyRowExist
                key={d}
                difficulty={td}
                userDifficulty={trackUser.difficulties[d]}
                onValueChange={onDifficultyValueChange}
                onAchievementValidChange={onAchievementValidChange}
              />
            ) : (
              <DifficultyRowEmpty key={d} difficulty={d} />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function DifficultyRowEmpty({ difficulty }: { difficulty: Difficulty }) {
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

function DifficultyRowExist({
  difficulty,
  userDifficulty,
  onValueChange,
  onAchievementValidChange,
}: {
  difficulty: TrackByDifficulty;
  userDifficulty: TrackUserDataByDifficulty | undefined;
  onValueChange: (d: TrackUserDataByDifficulty) => unknown;
  onAchievementValidChange: (d: Difficulty, valid: boolean) => unknown;
}) {
  if (userDifficulty === undefined) {
    throw Error(`user difficulty not found: ${difficulty.difficulty}`);
  }

  return (
    <TableRow>
      <TableCell>{difficultyToStr(difficulty.difficulty)}</TableCell>
      <TableCell align="right">{lvToString(difficulty.lv)}</TableCell>
      <TableCell>
        <AchievementInput
          achievement={userDifficulty.achievement}
          failed={userDifficulty.failed}
          onValueChange={(v) =>
            onValueChange({ ...userDifficulty, achievement: v })
          }
          onValidChange={(v) =>
            onAchievementValidChange(difficulty.difficulty, v)
          }
        />
      </TableCell>
      <TableCell align="center">
        <FailedInput
          achievement={userDifficulty.achievement}
          failed={userDifficulty.failed}
          onChange={(v) => onValueChange({ ...userDifficulty, failed: v })}
        />
      </TableCell>
      <TableCell align="right">
        {skillPointToDisplay(
          trackSkillPoint(difficulty.lv, userDifficulty.achievement),
        )}
      </TableCell>
      <TableCell>
        <TextField
          value={userDifficulty.movieURL}
          onChange={(e) =>
            onValueChange({ ...userDifficulty, movieURL: e.target.value })
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
  achievement,
  failed,
  onChange,
}: {
  achievement: number;
  failed: boolean;
  onChange: (value: boolean) => unknown;
}) {
  return (
    <Checkbox
      checked={failed}
      onChange={(e) => {
        onChange(e.target.checked);
      }}
      disabled={achievement !== 0}
    />
  );
}
