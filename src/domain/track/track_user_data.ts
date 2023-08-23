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
  /** 曲のID */
  trackId: string;

  /** 難易度 */
  difficulty: Difficulty;

  /**
   * 達成率
   *
   * 0〜1のfloat
   */
  achievement: number;

  /**
   * 獲得スキルポイント
   *
   * 達成率とLvが変わる度に再計算する
   */
  skillPoint: number;

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
