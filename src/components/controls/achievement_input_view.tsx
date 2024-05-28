import { InputAdornment, TextField } from "@mui/material";
import React from "react";

/** 達成率のテキストボックス */
export default function AchievementInputView({
  value,
  onChange,
  label,
  name,
  disabled,
  error,
  onBlur,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
  label?: string;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => unknown;
}) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      label={label}
      name={name}
      onBlur={onBlur}
      disabled={disabled}
      size="small"
      inputProps={{
        size: 5,
        inputMode: "decimal",
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      error={error}
    />
  );
}
