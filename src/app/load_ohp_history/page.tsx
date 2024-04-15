import { Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import createMetadata from "../_util/create_metadata";
import PageTitle from "../../components/page_title";
import CopyButton from "./copy_button";

const PAGE_TITLE = "公式ページからのプレイ履歴取得";
export const metadata = createMetadata(PAGE_TITLE);

function buildScript(): string {
  const urlPrefix = process.env.URL_PREFIX;
  if (urlPrefix === undefined) {
    throw new Error("env URL_PREFIX is empty");
  }

  const jsUrl = new URL("js/load_ohp_history.js", urlPrefix).toString();

  // eslint-disable-next-line no-script-url
  return `javascript:{let a="Basic "+btoa("USER:PASSWORD");fetch("${jsUrl}",{headers: {"Authorization": a}}).then(async (r) => {eval(await r.text())("${urlPrefix}", a)});}`;
}

/** 公式ページからのプレイ履歴取得ページ */
export default function Home() {
  const script = buildScript();

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <Stack spacing={1}>
        <Link href="https://p.eagate.573.jp/game/gfdm/gitadora_galaxywave/p/playdata/stage_result.html?gtype=dm&stype=">
          公式のプレー履歴ページ
        </Link>
        <Typography>
          このスクリプトの USER と PASSWORD
          を書き換えてブックマークに追加し、公式 HP の「プレー履歴」ページで実行
        </Typography>
        <Paper sx={{ padding: 1 }}>
          <code>${script}</code>
        </Paper>
        <CopyButton script={script} />
      </Stack>
    </main>
  );
}
