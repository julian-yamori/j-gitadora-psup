"use client";

import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchTrackInput() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const doSearch = async () => {
    await router.push(searchUrl(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await doSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box padding={1}>
        <TextField
          placeholder="曲を検索..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="small"
          inputProps={{ enterKeyHint: "search" }}
        />
        <IconButton onClick={doSearch} color="inherit">
          <SearchIcon />
        </IconButton>
      </Box>
    </form>
  );
}

function searchUrl(query: string): string {
  const searchParams = new URLSearchParams({ query });
  return `/tracks?${searchParams.toString()}`;
}
