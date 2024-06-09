"use client";

import { Button, Stack, Typography } from "@mui/material";
import LvInputView from "../../components/controls/lv_input_view";
import { save } from "./actions";
import { useState } from "react";
import {
  SaveSuccessSnackbar,
  useSaveSuccessSnackbarState,
} from "../../components/snackbar/save_success_snackbar";
import { useShowLoadingScreen } from "../../components/loading_screen";

export default function ClientRoot({
  initialMin,
  initialMax,
}: {
  initialMin: number | undefined;
  initialMax: number | undefined;
}) {
  const [min, setMin] = useState(initialMin?.toString());
  const [max, setMax] = useState(initialMax?.toString());
  const snackbarState = useSaveSuccessSnackbarState();
  const showLoadingScreen = useShowLoadingScreen();

  const handleSubmit = () => {
    showLoadingScreen(
      (async () => {
        await save(Number(min), Number(max));
        snackbarState.show();
      })(),
    );
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>適正 Lv</Typography>
            <LvInputView
              name="min"
              value={min?.toString() ?? ""}
              onChange={(e) => setMin(e.target.value)}
            />
            <Typography>〜</Typography>
            <LvInputView
              name="max"
              value={max?.toString() ?? ""}
              onChange={(e) => setMax(e.target.value)}
            />
          </Stack>

          <Button variant="contained" onClick={handleSubmit}>
            保存
          </Button>
        </Stack>
      </form>
      <SaveSuccessSnackbar state={snackbarState} />
    </>
  );
}
