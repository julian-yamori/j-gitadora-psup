import {
  ADVANCED,
  BASIC,
  Difficulty,
  EXTREME,
  MASTER,
} from "../domain/track/difficulty";
import { PlayHistory } from "./play_history";

/** 公式 HP のページからプレイ履歴を読み込み */
export default function readDocument(): PlayHistory[] {
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
  const getClass = (diff: string) => `score_data_diff.dm_${diff}`;

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
