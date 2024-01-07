import PageTitle from "@/components/page_title";
import { Container } from "@mui/material";
import ClientWrapper from "./client_wrapper";
import createMetadata from "../_util/create_metadata";

const PAGE_TITLE = "wikiの曲情報読み込み";
export const metadata = createMetadata(PAGE_TITLE);

/** wikiの曲情報読み込みページ */
export default function Home() {
  return (
    <main>
      <Container>
        <PageTitle title={PAGE_TITLE} />
        <ClientWrapper />
      </Container>
    </main>
  );
}
