"use client";

import {
  Difficulty,
  ALL_DIFFICULTIES,
  difficultyToStr,
} from "@/domain/track/difficulty";
import { INITIAL, OpenType } from "@/domain/track/open_type";
import { Track, TrackByDifficulty, lvToString } from "@/domain/track/track";
import {
  TrackUserData,
  TrackUserDataByDifficulty,
  achievementToPercent,
  trackSkillPoint,
} from "@/domain/track/track_user_data";
import {
  Checkbox,
  InputAdornment,
  Paper,
  Rating,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export default function TrackForm({
  track,
  initialTrackUser,
}: {
  track: Track;
  initialTrackUser: TrackUserData;
}) {
  const [trackUser, setTrackUser] = useState(initialTrackUser);

  return (
    <>
      <OpenSwitch
        openType={track.openType}
        isOpen={trackUser.isOpen}
        onChange={(v) => setTrackUser((old) => ({ ...old, isOpen: v }))}
      />

      <Typography component="legend">好み</Typography>
      <Rating
        value={trackUser.like}
        onChange={(_, v) =>
          setTrackUser((old) => ({ ...old, like: Number(v) }))
        }
      />

      {/* 難易度毎のtable */}
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
                  onValueChange={(v) =>
                    setTrackUser((old) => ({
                      ...old,
                      difficulties: { ...old.difficulties, [d]: v },
                    }))
                  }
                />
              ) : (
                <DifficultyRowEmpty key={d} difficulty={d} />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TextField label="メモ" multiline rows="3" fullWidth />
    </>
  );
}

function OpenSwitch({
  openType,
  isOpen,
  onChange,
}: {
  openType: OpenType;
  isOpen: boolean;
  onChange: (value: boolean) => unknown;
}) {
  if (openType === INITIAL) {
    return null;
  }

  return <Switch checked={isOpen} onChange={(_, v) => onChange(v)} />;
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
}: {
  difficulty: TrackByDifficulty;
  userDifficulty: TrackUserDataByDifficulty | undefined;
  onValueChange: (d: TrackUserDataByDifficulty) => unknown;
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
          onChange={(v) => onValueChange({ ...userDifficulty, achievement: v })}
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
        {trackSkillPoint(difficulty.lv, userDifficulty.achievement)}
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

function AchievementInput({
  achievement,
  failed,
  onChange,
}: {
  achievement: number;
  failed: boolean;
  onChange: (value: number) => unknown;
}) {
  return (
    <TextField
      value={achievementToPercent(achievement)}
      onChange={(e) => onChange(Number(e.target.value) / 100)}
      disabled={failed}
      size="small"
      inputProps={{
        size: 5,
      }}
      // eslint-disable-next-line react/jsx-no-duplicate-props -- iとIの両方に指定すべきものがある
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
    />
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
