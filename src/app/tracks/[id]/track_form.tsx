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
  skillPointToDisplay,
  trackSkillPoint,
} from "@/domain/track/track_user_data";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Rating,
  Stack,
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
import AchievementInput from "./achievement_input";

export default function TrackForm({
  track,
  initialTrackUser,
}: {
  track: Track;
  initialTrackUser: TrackUserData;
}) {
  const [trackUser, setTrackUser] = useState(initialTrackUser);

  // 達成率に不正な値が入力されている難易度のリスト
  const [invalidAchievements, setInvalidAchievements] = useState<
    ReadonlySet<Difficulty>
  >(new Set());

  const handleByDifficultyChanged = (newVal: TrackUserDataByDifficulty) => {
    setTrackUser((old) => ({
      ...old,
      difficulties: { ...old.difficulties, [newVal.difficulty]: newVal },
    }));
  };

  const handleAchievementValidChanged = (d: Difficulty, valid: boolean) => {
    setInvalidAchievements((old) => {
      if (valid) {
        if (old.has(d)) {
          const set = new Set(old);
          set.delete(d);
          return set;
        }
        return old;
      }
      // eslint-disable-next-line no-else-return -- 分岐を読みやすくするためelse追加
      else {
        if (old.has(d)) return old;
        return new Set([...old, d]);
      }
    });
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <FormGroup>
          <OpenSwitch
            openType={track.openType}
            isOpen={trackUser.isOpen}
            onChange={(v) => setTrackUser((old) => ({ ...old, isOpen: v }))}
          />

          <Stack direction="row" spacing={1}>
            <Typography>好み</Typography>
            <Rating
              value={trackUser.like}
              onChange={(_, v) =>
                setTrackUser((old) => ({ ...old, like: Number(v) }))
              }
            />
          </Stack>
        </FormGroup>

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
                    onValueChange={handleByDifficultyChanged}
                    onAchievementValidChange={handleAchievementValidChanged}
                  />
                ) : (
                  <DifficultyRowEmpty key={d} difficulty={d} />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TextField label="メモ" multiline rows="3" fullWidth />

        {invalidAchievements.size > 0 ? "不正値あり" : null}
      </Stack>
    </Paper>
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

  const label = isOpen ? "開放済み" : "未開放";

  return (
    <FormControlLabel
      control={<Switch checked={isOpen} onChange={(_, v) => onChange(v)} />}
      label={label}
    />
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
