"use client";

import React, { useEffect, useState } from "react";
import formKeyByScore from "../../api/tracks/form_key";
import AchievementInputView from "../../../components/controls/achievement_input_view";
import { Difficulty } from "../../../domain/track/difficulty";
import { achievementToPercent } from "../../../domain/track/achievement";

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
    <AchievementInputView
      label="達成率"
      name={formKeyByScore(difficulty, "achievement")}
      value={strValue}
      onChange={handleOnChange}
      onBlur={submit}
      disabled={failed}
      error={!valid}
    />
  );
}
