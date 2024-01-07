"use client";

import { ListItemText, MenuItem, MenuList } from "@mui/material";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <MenuList>
      <Item text="曲リスト" href="/tracks" />
      <Item text="wikiの曲情報読み込み" href="/load_wiki" />
    </MenuList>
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
