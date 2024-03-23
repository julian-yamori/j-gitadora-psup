import { Difficulty } from "../../../domain/track/difficulty";

/**
 * 譜面毎のフォーム項目のnameを生成
 * @param difficulty 難易度値
 * @param propName 譜面内での入力項目名
 */
export default function formKeyByScore(
  difficulty: Difficulty,
  propName: string,
): string {
  return `score_${difficulty}_${propName}`;
}
