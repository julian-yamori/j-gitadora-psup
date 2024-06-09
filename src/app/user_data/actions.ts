"use server";

import { saveMatchLevels } from "../../db/user_data";
import prismaClient from "../../db/prisma_client";
import { lvSchema } from "../../domain/track/track";

export async function save(min: number, max: number) {
  await saveMatchLevels(prismaClient, lvSchema.parse(min), lvSchema.parse(max));
}
