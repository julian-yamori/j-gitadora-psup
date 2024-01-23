import { Alert, Snackbar } from "@mui/material";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

/**
 * SaveSuccessSnackbar 用の状態保持オブジェクト
 */
export type SaveSuccessSnackbarState = Readonly<{
  isOpen: boolean;

  /** snackbar を表示 */
  show: () => void;

  setOpen: Dispatch<SetStateAction<boolean>>;
}>;

export function useSaveSuccessSnackbarState(): SaveSuccessSnackbarState {
  const [isOpen, setOpen] = useState(false);
  const state = useMemo(
    () => ({
      isOpen,
      show: () => {
        setOpen(true);
      },
      setOpen,
    }),
    [isOpen, setOpen],
  );

  return state;
}

export function SaveSuccessSnackbar({
  state,
}: {
  state: SaveSuccessSnackbarState;
}) {
  const handleClose = () => {
    state.setOpen(false);
  };

  return (
    <Snackbar open={state.isOpen} autoHideDuration={3000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        保存しました。
      </Alert>
    </Snackbar>
  );
}
