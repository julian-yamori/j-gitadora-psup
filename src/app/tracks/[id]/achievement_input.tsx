"use client";

import formKeyByDifficulty from "@/app/api/tracks/form_key";
import { Difficulty } from "@/domain/track/difficulty";
import { achievementToPercent } from "@/domain/track/track_user_data";
import { InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

/** 達成率のテキストボックス */
export default function AchievementInput({
  difficulty,
  achievement,
  failed,
  onValueChange,
  onValidChange,
}: {
  difficulty: Difficulty;
  achievement: number;
  failed: boolean;
  onValueChange: (value: number) => unknown;
  onValidChange: (valid: boolean) => unknown;
}) {
  const [strValue, setStrValue] = useState(achievementToPercent(achievement));
  const [valid, setValid] = useState(true);

  useEffect(() => {
    setStrValue(achievementToPercent(achievement));
  }, [achievement, setStrValue]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStrValue(e.target.value);
  };

  const submit = () => {
    const numValue = Number(strValue) / 100;
    const lValid = !Number.isNaN(numValue);
    setValid(lValid);
    onValidChange(lValid);

    if (lValid) {
      onValueChange(numValue);
    }
  };

  return (
    <TextField
      name={formKeyByDifficulty(difficulty, "achievement")}
      value={strValue}
      onChange={handleOnChange}
      onBlur={submit}
      disabled={failed}
      size="small"
      inputProps={{
        size: 5,
      }}
      // eslint-disable-next-line react/jsx-no-duplicate-props -- iとIの両方に指定すべきものがある
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      error={!valid}
    />
  );
}
