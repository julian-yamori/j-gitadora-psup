"use client";

import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationMenu from "./navigation_menu";

export default function AppBar() {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL変更時にメニューを閉じる
  useEffect(() => {
    setDrawerOpened(false);
  }, [pathname, searchParams]);

  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setDrawerOpened(true)}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6">j GITADORA psup</Typography>

        <Drawer open={drawerOpened} onClose={() => setDrawerOpened(false)}>
          <NavigationMenu />
        </Drawer>
      </Toolbar>
    </MuiAppBar>
  );
}
