import readDocument from "./read_document";

/**
 * ブックマークレットから呼び出される eval で渡す関数
 * @param urlPrefix j-gitadora-psup の URL のプリフィクス
 * @param auth j-gitadora-psup へのリクエストの Authorization ヘッダの値
 */
// eslint-disable-next-line @typescript-eslint/no-unused-expressions -- eval の結果としてこの関数式を渡す
async (urlPrefix: string, auth: string) => {
  let success = "0";

  try {
    // 表示中の公式 HP からプレイ履歴を読み込む
    const histories = readDocument();

    // j-gitadora-psup へプレイ履歴情報を登録
    const postUrl = new URL("api/load_ohp_history", urlPrefix);
    await fetch(postUrl, {
      method: "POST",
      body: JSON.stringify(histories),
      headers: {
        Authorization: auth,
      },
    });

    success = "1";
  } finally {
    // 読み込み結果ページに遷移
    const resultSearchParams = new URLSearchParams({ success });
    const resultUrl = new URL(
      `load_ohp_history/result?${resultSearchParams.toString()}`,
      urlPrefix,
    );
    window.open(resultUrl);
  }
};
