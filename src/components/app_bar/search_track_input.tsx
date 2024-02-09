"use client";

import { IconButton, InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/naming-convention -- component
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
}));

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
      <StyledInputBase
        placeholder="曲を検索..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <IconButton onClick={doSearch} color="inherit">
        <SearchIcon />
      </IconButton>
    </form>
  );
}

function searchUrl(query: string): string {
  const searchParams = new URLSearchParams({ query });
  return `/tracks?${searchParams.toString()}`;
}
