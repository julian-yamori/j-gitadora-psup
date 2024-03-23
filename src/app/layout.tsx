import { Inter } from "next/font/google";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AppBar from "../components/app_bar/app_bar";
import createMetadata from "./_util/create_metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = createMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className} style={{ margin: 0 }}>
        <AppBar />
        <div style={{ margin: 8 }}>{children}</div>
      </body>
    </html>
  );
}
