"use client";

import { Divider, ListItemText, MenuItem, MenuList } from "@mui/material";
import Link from "next/link";
import SearchTrackInput from "./search_track_input";

export default function NavigationMenu() {
  return (
    <>
      <SearchTrackInput />
      <Divider />
      <MenuList>
        <Item text="譜面クエリ" href="/scores" />
      </MenuList>
    </>
  );
}

function Item({ text, href }: { text: string; href: string }) {
  return (
    <Link href={href}>
      <MenuItem>
        <ListItemText>{text}</ListItemText>
      </MenuItem>
    </Link>
  );
}
