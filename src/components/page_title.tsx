import { Typography } from "@mui/material";

/** ページ先頭のページ名の見出し */
export default function PageTitle({ title }: { title: string }) {
  return <Typography variant="h4">{title}</Typography>;
}
