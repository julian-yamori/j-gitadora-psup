import PageTitle from "../../components/page_title";
import createMetadata from "../_util/create_metadata";
import ClientRoot from "./client_root";

const PAGE_TITLE = "譜面を詳細検索";
export const metadata = createMetadata(PAGE_TITLE);

export default function Home() {
  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <ClientRoot />
    </main>
  );
}
