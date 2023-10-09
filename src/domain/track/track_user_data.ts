import { Difficulty } from "./difficulty";

/**
 * 曲のユーザー編集データ
 *
 * 集約ルート
 */
export type TrackUserData = Readonly<{
  /** 曲のID */
  id: string;

  /**
   * 好み度
   *
   * 1〜5の整数
   */
  like: number;

  /** 開放しているかどうか */
  isOpen: boolean;

  /** 曲ごとのメモ */
  memo: string;

  /** 難易度毎の情報 */
  difficulties: Readonly<Record<Difficulty, TrackUserDataByDifficulty>>;
}>;

/** 曲の難易度別のユーザー編集データ */
export type TrackUserDataByDifficulty = Readonly<{
  /** 曲のID (key) */
  trackId: string;

  /** 難易度 (key) */
  difficulty: Difficulty;

  /**
   * 曲のプレイ時の得点情報
   *
   * 未プレイならundefined
   */
  score: TrackScore | undefined;

  /** ウィッシュリストの練習枠 */
  wishPractice: boolean;

  /** ウィッシュリストの達成率強化枠 */
  wishAchievement: boolean;

  /** ウィッシュリストのイベント対象曲枠 */
  wishEvent: boolean;

  /** ウィッシュリストのNextPickマーク (次にプレイする曲) */
  wishNextPick: boolean;

  /** ウィッシュリストのPlayedマーク (今日はもうプレイした) */
  wishPlayed: boolean;

  /** 譜面参考動画のURL */
  movieURL: string;
}>;

export type TrackScore = Readonly<{
  /** 達成率 */
  achievement: TrackAchievement;

  /**
   * 獲得スキルポイント
   *
   * 達成率とLvが変わる度に再計算する
   */
  skillPoint: number;
}>;

/**
 * 曲の達成率
 * 0〜1のfloatか、失敗した場合はfailed
 */
export type TrackAchievement = number | "failed";
