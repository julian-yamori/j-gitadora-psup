import { Difficulty } from "@/domain/track/difficulty";

/**
 * 難易度毎のフォーム項目のnameを生成
 * @param difficulty 難易度値
 * @param propName 難易度内での入力項目名
 */
export default function formKeyByDifficulty(
  difficulty: Difficulty,
  propName: string,
): string {
  return `diff${difficulty}_${propName}`;
}
