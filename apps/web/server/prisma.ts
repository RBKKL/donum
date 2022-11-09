/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from "@prisma/client";
import { serverEnv } from "@env/server";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      serverEnv.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (serverEnv.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}
