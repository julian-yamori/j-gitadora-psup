"use client";

import { Alert, Button, Snackbar } from "@mui/material";
import { useState } from "react";

/** 公式 HP プレイ履歴読み込みの、スクリプトをクリップボードコピーするボタン */
export default function CopyButton({ script }: { script: string }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Button variant="contained" onClick={handleCopy}>
        COPY
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          コピーしました。
        </Alert>
      </Snackbar>
    </>
  );
}
