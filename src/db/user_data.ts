// UserData テーブル関連

import { PrismaTransaction } from "./prisma_client";

const RECORD_ID = "0";

export async function loadPlayingMemo(
  prismaTransaction: PrismaTransaction,
): Promise<string> {
  return (
    await prismaTransaction.userData.findUniqueOrThrow({
      select: { playingMemo: true },
      where: { id: RECORD_ID },
    })
  ).playingMemo;
}

export async function savePlayingMemo(
  prismaTransaction: PrismaTransaction,
  memo: string,
): Promise<void> {
  await prismaTransaction.userData.update({
    where: { id: RECORD_ID },
    data: { playingMemo: memo },
  });
}

/** 適正 Lv の情報 */
export type MatchLevels = {
  min: number | undefined;
  max: number | undefined;
};

export async function loadMatchLevels(
  prismaTransaction: PrismaTransaction,
): Promise<MatchLevels> {
  const { matchLvMin, matchLvMax } =
    await prismaTransaction.userData.findUniqueOrThrow({
      select: { matchLvMin: true, matchLvMax: true },
      where: { id: RECORD_ID },
    });

  return {
    min: matchLvMin ?? undefined,
    max: matchLvMax ?? undefined,
  };
}

export async function saveMatchLevels(
  prismaTransaction: PrismaTransaction,
  min: number,
  max: number,
): Promise<void> {
  await prismaTransaction.userData.update({
    where: { id: RECORD_ID },
    data: { matchLvMin: min, matchLvMax: max },
  });
}
