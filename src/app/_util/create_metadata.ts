import type { Metadata } from "next";

/** ページのmetadata作成 */
export default function createMetadata(pageTitle?: string): Metadata {
  return {
    title: title(pageTitle),
  };
}

function title(pageTitle: string | undefined): string {
  const appTitle = "j GITADORA psup";

  if (pageTitle === undefined) {
    return appTitle;
  }

  return `${pageTitle} - ${appTitle}`;
}
