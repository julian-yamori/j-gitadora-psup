import createMetadata from "../_util/create_metadata";

const PAGE_TITLE = "公式ページからのプレイ履歴取得";
export const metadata = createMetadata(PAGE_TITLE);

const script =
  // eslint-disable-next-line no-script-url
  'javascript:{let a="Basic "+btoa("USER:PASSWORD");fetch("http://localhost:3000/js/load_ohp_history.js",{headers: {"Authorization": a}}).then(async (r) => {eval(await r.text())("http://localhost:3000", a)});}';

/** 公式ページからのプレイ履歴取得ページ */
export default async function Home() {
  return (
    <main>
      <code>${script}</code>
    </main>
  );
}
