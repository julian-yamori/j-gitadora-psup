import PageTitle from "../../components/page_title";
import createMetadata from "../_util/create_metadata";
import ClientRoot from "./client_root";

const PAGE_TITLE = "譜面クエリ";
export const metadata = createMetadata(PAGE_TITLE);

export default async function Home() {
  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <ClientRoot />
    </main>
  );
}
