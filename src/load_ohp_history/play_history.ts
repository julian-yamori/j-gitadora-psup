import { Difficulty } from "../domain/track/difficulty";

/** 公式 HP から読み込んだ、プレイ履歴一つのデータ */
export type PlayHistory = Readonly<{
  title: string;
  difficulty: Difficulty;
  achievement: number;
}>;
