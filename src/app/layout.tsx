import { Inter } from "next/font/google";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Suspense } from "react";
import AppBar from "../components/app_bar/app_bar";
import createMetadata from "./_util/create_metadata";
import {
  LoadingScreen,
  LoadingScreenProvider,
} from "../components/loading_screen";

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
        <LoadingScreenProvider>
          <Suspense>
            <AppBar />
            <div style={{ margin: 8 }}>{children}</div>
          </Suspense>
          <LoadingScreen />
        </LoadingScreenProvider>
      </body>
    </html>
  );
}
