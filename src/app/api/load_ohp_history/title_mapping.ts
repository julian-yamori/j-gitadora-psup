import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

/**
 * 公式 HP の曲名を DB (wiki側) の曲名に変換する Record
 */
export type TitleMapping = Readonly<Record<string, string>>;

const schema = z.record(z.string(), z.string());

export async function loadTitleMapping(): Promise<TitleMapping> {
  const filePath = path.join(process.cwd(), "title_mapping.json");
  const text = await fs.promises.readFile(filePath, {
    encoding: "utf-8",
  });
  const obj: unknown = JSON.parse(text);

  return schema.parse(obj);
}
