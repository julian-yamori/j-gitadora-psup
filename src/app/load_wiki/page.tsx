import { Container, Typography } from "@mui/material";
import ClientWrapper from "./client_wrapper";

export const metadata = {
  title: "wikiの曲情報読み込み",
};

/** wikiの曲情報読み込みページ */
export default function Home() {
  return (
    <main>
      <Container>
        <Typography variant="h4">wikiの曲情報読み込み</Typography>
        <ClientWrapper />
      </Container>
    </main>
  );
}
