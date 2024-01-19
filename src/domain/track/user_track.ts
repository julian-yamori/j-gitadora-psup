import { Difficulty } from "./difficulty";
import { isOpenTypeInitialOpen } from "./open_type";
import { Track } from "./track";

/**
 * 曲のユーザー編集データ
 *
 * 集約ルート
 */
export type UserTrack = Readonly<{
  /** 曲のID */
  id: string;

  /**
   * 好み度
   *
   * 1〜5の整数
   */
  like: number | undefined;

  /** 開放しているかどうか */
  isOpen: boolean;

  /** 曲ごとのメモ */
  memo: string;

  /** 曲の譜面 */
  scores: UserTrackScores;
}>;

/** 曲の全譜面のユーザー編集データ */
export type UserTrackScores = Readonly<{
  readonly [K in Difficulty]?: UserScore;
}>;

/** 譜面のユーザー編集データ */
export type UserScore = Readonly<{
  /** 曲のID (key) */
  trackId: string;

  /** 難易度 (key) */
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

  /**
   * 失敗マーク
   *
   * 「挑戦したことはあるけど失敗した」と「未挑戦」の区別を付ける用。
   *
   * UI上では、達成率と失敗のどちらかしか入力不可。
   * ただしスキルポイントの計算では、achievementのみ入力可
   */
  failed: boolean;

  // todo ウィッシュリスト関係は別モデルの方がいいかも

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

/**
 * @param track 初期値の元になるTrack
 * @return 初期状態の UserTrack
 */
export function initialUserTrack(track: Track): UserTrack {
  const scores = Object.fromEntries(
    [...Object.values(track.scores)].map((d): [Difficulty, UserScore] => [
      d.difficulty,
      {
        trackId: d.trackId,
        difficulty: d.difficulty,
        achievement: 0,
        skillPoint: 0,
        failed: false,
        wishPractice: false,
        wishAchievement: false,
        wishEvent: false,
        wishNextPick: false,
        wishPlayed: false,
        movieURL: "",
      },
    ]),
  );

  return {
    id: track.id,
    like: undefined,
    isOpen: isOpenTypeInitialOpen(track.openType),
    memo: "",
    scores,
  };
}

/**
 * UserTrack.like が有効な値か確認
 * @param like 確認するlikeの値
 * @return 有効な値ならtrueを返す
 */
export function validateTrackLike(like: number): boolean {
  if (!Number.isInteger(like)) return false;
  if (like < 1 || like > 5) return false;
  return true;
}

/**
 * スキルポイントを計算
 * @param lv 曲の難易度値
 * @param achievement 曲の達成率
 */
export function trackSkillPoint(lv: number, achievement: number): number {
  // lv * 達成率 * 20 (0.01単位で端数切り捨て)
  return Math.floor(lv * achievement * 2000) / 100;
}

/** 達成率の数値をパーセント表記の文字列に変換 */
export function achievementToPercent(achievement: number): string {
  return (achievement * 100).toFixed(2);
}

/** スキルポイントを表示用の文字列に変換 */
export function skillPointToDisplay(skillPoint: number): string {
  return skillPoint.toFixed(2);
}
