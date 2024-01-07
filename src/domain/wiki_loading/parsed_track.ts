import { TrackByDifficulty } from "@prisma/client";
import { Track } from "@/domain/track/track";
import { Difficulty } from "@/domain/track/difficulty";
import { WikiLoadingSource } from "./wiki_loading_source";

/** HTMLから読み込んだ直後の曲データ */
export type ParsedTrack = Omit<Track, "id" | "difficulties"> & {
  difficulties: ParsedDifficulties;

  /** HTMLの取得元 */
  source: WikiLoadingSource;
  /** テーブル行の番号 */
  rowNo: number;
};

/** HTMLから読み込んだ直後の曲データの、難易度別データ */
export type ParsedDifficulty = Omit<TrackByDifficulty, "trackId">;

export type ParsedDifficulties = Readonly<{
  [K in Difficulty]?: ParsedDifficulty;
}>;

/** ParsedTrackの曲情報の内容が一致しているか比較 */
export function isEqualsParsedTrack(t1: ParsedTrack, t2: ParsedTrack): boolean {
  if (
    t1.title !== t2.title ||
    t1.skillType !== t2.skillType ||
    t1.long !== t2.long ||
    t1.openType !== t2.openType
  ) {
    return false;
  }

  const diffs1 = [...Object.values(t1.difficulties)];
  const diffs2 = [...Object.values(t2.difficulties)];

  // 難易度数を比較
  if (diffs1.length !== diffs2.length) {
    return false;
  }

  // 難易度の内容を比較
  for (const d1 of diffs1) {
    const d2 = diffs2.find((d) => d.difficulty === d1.difficulty);
    if (d2 === undefined) return false;

    if (d1.lv !== d2.lv) return false;
  }

  return true;
}
