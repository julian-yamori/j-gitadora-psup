import createMetadata from "../_util/create_metadata";

const PAGE_TITLE = "公式ページからのプレイ履歴取得";
export const metadata = createMetadata(PAGE_TITLE);

const script =
  'fetch("http://localhost:3000/js/load_ohp_history.js",{headers: {"Authorization": "Basic " + btoa("USER:PASSWORD")}}).then(async (response) => {eval(await response.text())("http://localhost:3000")});';

/** 公式ページからのプレイ履歴取得ページ */
export default async function Home() {
  return (
    <main>
      <code>${script}</code>
    </main>
  );
}
