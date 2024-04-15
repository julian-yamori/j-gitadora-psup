const BASIC = 1;
const ADVANCED = 2;
const EXTREME = 3;
const MASTER = 4;

type Difficulty =
  | typeof BASIC
  | typeof ADVANCED
  | typeof EXTREME
  | typeof MASTER;

/** 公式 HP から読み込んだ、プレイ履歴一つのデータ */
type PlayHistory = Readonly<{
  title: string;
  difficulty: Difficulty;
  achievement: number;
}>;

/**
 * ブックマークレットから呼び出される eval で渡す関数
 * @param urlPrefix j-gitadora-psup の URL のプリフィクス
 * @param auth j-gitadora-psup へのリクエストの Authorization ヘッダの値
 */
async (urlPrefix: string, auth: string) => {
  /** 公式 HP のページからプレイ履歴を読み込み */
  function readDocument(): PlayHistory[] {
    const trackElements = document.querySelectorAll(".sr_list_tb");
    if (trackElements.length === 0) {
      throw Error("history not found");
    }

    return [...trackElements.values()].map(readTrackElement);
  }

  /** 曲一つの Element を読み込む */
  function readTrackElement(trackElement: Element): PlayHistory {
    const title = elemGetText(trackElement.querySelector(".title"));

    const achievementStr = elemGetText(
      trackElement.querySelector(
        ".sr_data_score_tb tr:nth-child(10) .score_data",
      ),
    );

    return {
      title,
      difficulty: findDifficulty(trackElement),
      achievement: strToAchievement(achievementStr),
    };
  }

  /** Element のテキストを取得 */
  function elemGetText(element: Element | null): string {
    if (element === null) {
      throw new Error("element is null");
    }

    const text = element?.textContent;
    if (text === null) {
      throw new Error("text is null");
    }

    return text.trim();
  }

  const ACHIEVEMENT_REGEX = /^([\d.]+)%$/;

  /** 達成率の文字列を数値に変換 */
  function strToAchievement(str: string): number {
    const match = str.match(ACHIEVEMENT_REGEX);
    if (!match) {
      throw new Error("achievement format is invalid");
    }

    const num = Number(match[1]);
    if (Number.isNaN(num)) {
      throw new Error("achievement format is invalid");
    }

    return num / 100;
  }

  /** 曲の Element から難易度を取得 */
  function findDifficulty(element: Element): Difficulty {
    const getClass = (diff: string) => `.score_data_diff.dm_${diff}`;

    if (element.querySelector(getClass("bsc"))) {
      return BASIC;
    }
    if (element.querySelector(getClass("adv"))) {
      return ADVANCED;
    }
    if (element.querySelector(getClass("ext"))) {
      return EXTREME;
    }
    if (element.querySelector(getClass("mst"))) {
      return MASTER;
    }

    throw new Error("difficulty not found");
  }

  /** j-gitadora-psup へプレイ履歴情報を登録 */
  async function postJgdps(histories: ReadonlyArray<PlayHistory>) {
    const postUrl = new URL("api/load_ohp_history", urlPrefix);
    const response = await fetch(postUrl, {
      method: "POST",
      body: JSON.stringify(histories),
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      throw new Error(`failed to post history.`);
    }
  }

  /** 読み込み結果ページに遷移 */
  function openResultPage(success: string) {
    const resultSearchParams = new URLSearchParams({ success });
    const resultUrl = new URL(
      `load_ohp_history/result?${resultSearchParams.toString()}`,
      urlPrefix,
    );
    window.open(resultUrl);
  }

  /** クライアント側処理の本体 */
  async function main() {
    let success = "0";

    try {
      // 表示中の公式 HP からプレイ履歴を読み込む
      const histories = readDocument();
      await postJgdps(histories);
      success = "1";
    } finally {
      openResultPage(success);
    }
  }
  await main();
};
