import PageTitle from "../../components/page_title";
import { loadMatchLevels } from "../../db/user_data";
import prismaClient from "../../db/prisma_client";
import createMetadata from "../_util/create_metadata";
import ClientRoot from "./client_root";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "ユーザーデータ";
export const metadata = createMetadata(PAGE_TITLE);

/** ユーザーデータページ */
export default async function Home() {
  const { min, max } = await loadMatchLevels(prismaClient);

  return (
    <main>
      <PageTitle title={PAGE_TITLE} />
      <ClientRoot initialMin={min} initialMax={max} />
    </main>
  );
}
