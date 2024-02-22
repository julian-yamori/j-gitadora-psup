"use client";

import { ListItemText, MenuItem, MenuList } from "@mui/material";
import Link from "next/link";

export default function NavigationMenu() {
  return (
    <MenuList>
      <Item text="譜面クエリ" href="/scores" />
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
