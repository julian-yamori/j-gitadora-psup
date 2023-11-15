"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import getRefNonNull from "../_util/get_ref_non_null";
import assertResponseOk from "../_util/assert_response_ok";

/** wikiの曲情報読み込みページ のクライアント側の機能 */
export default function ClientWrapper() {
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // 読込ボタンイベント
  const handleLoad = async () => {
    const formCurrent = getRefNonNull(form);
    if (!formCurrent.reportValidity()) return;

    // API呼び出しfetch
    assertResponseOk(
      await fetch("/api/load_wiki/load", {
        method: "POST",
        body: new FormData(formCurrent),
      }),
    );

    await router.push("/load_wiki/confirm");
  };

  return (
    <form ref={form} onSubmit={(e) => e.preventDefault()}>
      <Stack spacing={1}>
        <TextField
          id="test"
          name="test"
          label="新曲リスト"
          multiline
          rows="10"
          fullWidth
        />
        <Box>
          <Button variant="contained" onClick={handleLoad}>
            読込
          </Button>
        </Box>
      </Stack>
    </form>
  );
}
