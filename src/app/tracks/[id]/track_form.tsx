"use client";

import assertResponseOk from "@/app/_util/assert_response_ok";
import getRefNonNull from "@/app/_util/get_ref_non_null";
import { Difficulty } from "@/domain/track/difficulty";
import { INITIAL, OpenType } from "@/domain/track/open_type";
import { Track } from "@/domain/track/track";
import {
  TrackUserData,
  TrackUserDataByDifficulty,
} from "@/domain/track/track_user_data";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  Rating,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import DifficultiesTable from "./difficulties_table";

export default function TrackForm({
  track,
  initialTrackUser,
}: {
  track: Track;
  initialTrackUser: TrackUserData;
}) {
  const form = useRef<HTMLFormElement>(null);
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
      } else {
        if (old.has(d)) return old;
        return new Set([...old, d]);
      }
    });
  };

  const handleSubmit = async () => {
    const formCurrent = getRefNonNull(form);
    if (!formCurrent.reportValidity()) return;

    // API呼び出しfetch
    assertResponseOk(
      await fetch(`/api/tracks/${track.id}`, {
        method: "POST",
        body: new FormData(formCurrent),
      }),
    );

    window.alert("ok");
  };

  const valid = invalidAchievements.size === 0;

  return (
    <Paper sx={{ padding: 2 }}>
      <form ref={form} onSubmit={(e) => e.preventDefault()}>
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
                name="like"
                value={trackUser.like}
                onChange={(_, v) =>
                  setTrackUser((old) => ({ ...old, like: Number(v) }))
                }
              />
            </Stack>
          </FormGroup>

          {/* 難易度毎のtable */}
          <DifficultiesTable
            track={track}
            trackUser={trackUser}
            onDifficultyValueChange={handleByDifficultyChanged}
            onAchievementValidChange={handleAchievementValidChanged}
          />

          <TextField name="memo" label="メモ" multiline rows="3" fullWidth />

          <Button variant="contained" onClick={handleSubmit} disabled={!valid}>
            保存
          </Button>
        </Stack>
      </form>
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
      control={
        <Switch
          name="is_open"
          checked={isOpen}
          onChange={(_, v) => onChange(v)}
        />
      }
      label={label}
    />
  );
}
