import { InputAdornment, TextField } from "@mui/material";
import React from "react";

/** 達成率のテキストボックス */
export default function AchievementInputView({
  value,
  onChange,
  name,
  disabled,
  error,
  onBlur,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
  name?: string;
  disabled?: boolean;
  error?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => unknown;
}) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      name={name}
      onBlur={onBlur}
      disabled={disabled}
      size="small"
      style={{ width: "6.5rem" }}
      inputProps={{
        inputMode: "decimal",
      }}
      // eslint-disable-next-line react/jsx-no-duplicate-props -- iとIの両方に指定すべきものがある
      InputProps={{
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      }}
      error={error}
    />
  );
}
