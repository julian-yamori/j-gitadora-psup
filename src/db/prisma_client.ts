import "server-only";
import { PrismaClient } from "@prisma/client";

// next dev でインスタンスが複製される問題の回避
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

const prismaClientSingleton = () => new PrismaClient();

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var prismaClient: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prismaClient = globalThis.prismaClient ?? prismaClientSingleton();

export default prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaClient = prismaClient;
}

/** PrismaClientとトランザクションのどちらも受け付けられる型 */
export type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
