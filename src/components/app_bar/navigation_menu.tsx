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
        <Item text="スキル対象曲" href="/skill_range" />
        <Item text="公式 HP の履歴読み込み" href="/load_ohp_history" />
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
