import { Alert, Snackbar } from "@mui/material";
import { useMemo, useState } from "react";

/**
 * FailedSnackbar 用の状態保持オブジェクト
 */
export type FailedSnackbarState = Readonly<{
  isOpen: boolean;
  message: string;
  show: (message: string) => void;
  hide: () => void;
}>;

export function useFailedSnackbarState(): FailedSnackbarState {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const state = useMemo(
    () => ({
      isOpen,
      message,
      show: (m: string) => {
        setMessage(m);
        setOpen(true);
      },
      hide: () => {
        setOpen(false);
      },
    }),
    [isOpen, message],
  );

  return state;
}

export function FailedSnackbar({ state }: { state: FailedSnackbarState }) {
  const handleClose = () => {
    state.hide();
  };

  return (
    <Snackbar open={state.isOpen} autoHideDuration={3000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {state.message}
      </Alert>
    </Snackbar>
  );
}
