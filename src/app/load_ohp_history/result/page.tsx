import createMetadata from "../../_util/create_metadata";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "プレイ履歴の取得完了";
export const metadata = createMetadata(PAGE_TITLE);

/** プレイ履歴の取得完了ページ */
export default async function Home() {
  return <main>test</main>;
}
