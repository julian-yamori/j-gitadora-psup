import { z } from "zod";

// DB からのレコード取得時のページング指定
export const pagingSchema = z
  .object({
    skip: z.number().int().gte(0).optional(),
    take: z.number().int().positive().optional(),
  })
  .readonly();
export type Paging = z.infer<typeof pagingSchema>;
