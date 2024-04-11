import createMetadata from "../../_util/create_metadata";
import { getTestCache } from "../../api/load_ohp_history/route";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "プレイ履歴の取得完了";
export const metadata = createMetadata(PAGE_TITLE);

/** プレイ履歴の取得完了ページ */
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const success = searchParams.success ?? "0";

  if (success !== "1") {
    return <main>プレイ履歴の取得に失敗しました。</main>;
  }

  return (
    <main>
      <ul>
        {[...getTestCache()].map(([k, v]) => (
          <li key={k}>
            {k}: {v}
          </li>
        ))}
      </ul>
    </main>
  );
}
