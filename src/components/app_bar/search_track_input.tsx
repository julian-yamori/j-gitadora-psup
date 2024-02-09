"use client";

import { IconButton, InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/naming-convention -- component
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
}));

export default function SearchTrackInput() {
  const [value, setValue] = useState("");

  const doSearch = () => {
    window.alert(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
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
