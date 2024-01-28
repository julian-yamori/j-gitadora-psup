import { TextField } from "@mui/material";

/** Lv のテキストボックス */
export default function LvInputView({
  value,
  onChange,
  name,
  disabled,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
  name?: string;
  disabled?: boolean;
}) {
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      size="small"
      inputProps={{
        size: 4,
      }}
    />
  );
}
