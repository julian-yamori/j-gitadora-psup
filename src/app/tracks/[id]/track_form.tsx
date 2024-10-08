"use client";

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
import assertResponseOk from "../../_util/assert_response_ok";
import getRefNonNull from "../../_util/get_ref_non_null";
import {
  SaveSuccessSnackbar,
  useSaveSuccessSnackbarState,
} from "../../../components/snackbar/save_success_snackbar";
import { ALL_DIFFICULTIES, Difficulty } from "../../../domain/track/difficulty";
import { INITIAL, OpenType } from "../../../domain/track/open_type";
import { Track } from "../../../domain/track/track";
import { UserTrack, UserScore } from "../../../domain/track/user_track";
import { useShowLoadingScreen } from "../../../components/loading_screen";
import { ScoreView } from "./score_view";

export default function TrackForm({
  track,
  initialUserTrack,
}: {
  track: Track;
  initialUserTrack: UserTrack;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [userTrack, setUserTrack] = useState(initialUserTrack);
  const snackbarState = useSaveSuccessSnackbarState();
  const showLoadingScreen = useShowLoadingScreen();

  // 達成率に不正な値が入力されている難易度のリスト
  const [invalidAchievements, setInvalidAchievements] = useState<
    ReadonlySet<Difficulty>
  >(new Set());

  const handleScoreChanged = (newVal: UserScore) => {
    setUserTrack((old) => ({
      ...old,
      scores: { ...old.scores, [newVal.difficulty]: newVal },
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

  const handleSubmit = () => {
    const formCurrent = getRefNonNull(form);
    if (!formCurrent.reportValidity()) return;

    showLoadingScreen(
      (async () => {
        // API呼び出しfetch
        assertResponseOk(
          await fetch(`/api/tracks/${track.id}`, {
            method: "POST",
            body: new FormData(formCurrent),
          }),
        );

        snackbarState.show();
      })(),
    );
  };

  const valid = invalidAchievements.size === 0;

  return (
    <Paper sx={{ padding: 2 }}>
      <form ref={form} onSubmit={(e) => e.preventDefault()}>
        <Stack spacing={2}>
          <FormGroup>
            <OpenSwitch
              openType={track.openType}
              isOpen={userTrack.isOpen}
              onChange={(v) => setUserTrack((old) => ({ ...old, isOpen: v }))}
            />

            <Stack direction="row" spacing={1}>
              <Typography>好み</Typography>
              <Rating
                name="like"
                value={userTrack.like}
                onChange={(_, v) =>
                  setUserTrack((old) => ({ ...old, like: Number(v) }))
                }
              />
            </Stack>
          </FormGroup>

          <TextField
            name="memo"
            label="メモ"
            value={userTrack.memo}
            onChange={(e) =>
              setUserTrack((old) => ({ ...old, memo: e.target.value }))
            }
            multiline
            fullWidth
          />

          {ALL_DIFFICULTIES.map((d) => {
            const score = track.scores[d];
            return score !== undefined ? (
              <ScoreView
                key={d}
                score={score}
                userScore={userTrack.scores[d]}
                onValueChange={handleScoreChanged}
                onAchievementValidChange={handleAchievementValidChanged}
              />
            ) : null;
          })}

          <Button variant="contained" onClick={handleSubmit} disabled={!valid}>
            保存
          </Button>
        </Stack>
      </form>
      <SaveSuccessSnackbar state={snackbarState} />
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
