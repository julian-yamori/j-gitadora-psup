import prismaClient from "@/db/prisma_client";
import CheckViewQueryService, {
  CheckViewIssueDto,
  CheckViewIssueDtoDelete,
  CheckViewIssueDtoDiffirence,
  CheckViewIssueDtoError,
  CheckViewIssueDtoNew,
} from "@/db/wiki_loading/check_view_query_service";
import { WikiLoadingSource } from "@/domain/wiki_loading/wiki_loading_source";
import RegisterButton from "./register_button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "wikiの曲情報読み込み - 確認",
};

/** wikiの曲情報読み込み確認ページ */
export default async function Home() {
  const issues = await new CheckViewQueryService(prismaClient).issues();
  const errorCount = issues.filter((i) => i.type === "error").length;

  return (
    <>
      <p>{issues.length} 件の相違点がありました。</p>
      {errorCount > 0 ? (
        <p style={{ color: "red" }}>エラーが {errorCount} 件あります。</p>
      ) : null}
      {issues.map((issue, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <IssueView key={i} issue={issue} />
      ))}
      <RegisterButton disabled={errorCount > 0} />
    </>
  );
}

function IssueView({ issue }: { issue: CheckViewIssueDto }) {
  switch (issue.type) {
    case "new":
      return <IssueViewNew issue={issue} />;
    case "diff":
      return <IssueViewDiffirence issue={issue} />;
    case "delete":
      return <IssueViewDelete issue={issue} />;
    case "error":
      return <IssueViewError issue={issue} />;
  }
}

function IssueViewNew({ issue }: { issue: CheckViewIssueDtoNew }) {
  return (
    <>
      <h2>追加：{issue.title}</h2>
      <HtmlPositionView source={issue.source} rowNo={issue.rowNo} />
    </>
  );
}

function IssueViewDiffirence({
  issue,
}: {
  issue: CheckViewIssueDtoDiffirence;
}) {
  return (
    <>
      <h2>変更：{issue.title}</h2>
      <HtmlPositionView source={issue.source} rowNo={issue.rowNo} />
      <ul>
        {issue.diffirences.map((diff, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i}>
            {diff.difficulty !== undefined ? `(${diff.difficulty}) ` : ""}
            {diff.propertyName}
            {" : "}
            {diff.oldValue ?? "-"}
            {" → "}
            {diff.newValue ?? "-"}
          </li>
        ))}
      </ul>
    </>
  );
}

function IssueViewDelete({ issue }: { issue: CheckViewIssueDtoDelete }) {
  return <h2>削除：{issue.title}</h2>;
}

function IssueViewError({ issue }: { issue: CheckViewIssueDtoError }) {
  return (
    <>
      <h2>エラー</h2>
      <HtmlPositionView source={issue.source} rowNo={issue.rowNo} />
      <p>{issue.message}</p>
    </>
  );
}

function HtmlPositionView({
  source,
  rowNo,
}: {
  source: WikiLoadingSource;
  rowNo: number | undefined;
}) {
  return (
    <>
      {sourceToViewText(source)} ({rowNo})
    </>
  );
}

function sourceToViewText(source: WikiLoadingSource): string {
  switch (source) {
    case "new":
      return "新曲リスト";
    case "old_GFDM":
      return "旧曲リスト 初代〜SG3";
    case "old_GD":
      return "旧曲リスト GITADORA";
  }
}
