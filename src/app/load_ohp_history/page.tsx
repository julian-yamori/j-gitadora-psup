import { Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import createMetadata from "../_util/create_metadata";
import PageTitle from "../../components/page_title";
import CopyButton from "./copy_button";
import fs from "node:fs";
import path from "node:path";

const PAGE_TITLE = "公式ページからのプレイ履歴取得";
export const metadata = createMetadata(PAGE_TITLE);

async function buildScript(): Promise<string> {
  // 環境変数から URL prefix を取得
  const urlPrefix = process.env.URL_PREFIX;
  if (urlPrefix === undefined) {
    throw new Error("env URL_PREFIX is empty");
  }

  // クライアント側で実行するための JavaScript をファイルから読み込み
  const filePath = path.join(process.cwd(), "load_ohp_history.js");
  const script = await fs.promises.readFile(filePath, {
    encoding: "utf-8",
  });

  // スクリプト内の URL を環境変数から取得したものに差し替え
  return script.replace(
    'const urlPrefix = "http://localhost:3000";',
    `const urlPrefix = "${urlPrefix}";`,
  );
}

/** 公式ページからのプレイ履歴取得ページ */
export default async function Home() {
  const script = await buildScript();

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <Stack spacing={1}>
        <Link href="https://p.eagate.573.jp/game/gfdm/gitadora_galaxywave/p/playdata/stage_result.html?gtype=dm&stype=">
          公式のプレー履歴ページ
        </Link>
        <Typography>
          このスクリプトの USER と PASSWORD を書き換えて Tampermonkey
          のスクリプトに追加し、公式 HP の「プレー履歴」ページを開く。
        </Typography>
        <Paper sx={{ padding: 1 }}>
          <code style={{ whiteSpace: "pre-wrap" }}>{script}</code>
        </Paper>
        <CopyButton script={script} />
      </Stack>
    </main>
  );
}
