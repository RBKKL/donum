// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@donum/prisma";
import { buckets } from "@server/storage";
import { fileUploadsStore } from "@server/uploads";
import { Session, unstable_getServerSession } from "next-auth";
import { getAuthOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 *  - testing, where we dont have to Mock Next.js' req/res
 *  - trpc's `createSSGHelpers` where we don't have req/res
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContextInner = async ({ session }: CreateContextOptions) => {
  return {
    session,
    prisma,
    buckets,
    fileUploadsStore,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await unstable_getServerSession(
    req,
    res,
    getAuthOptions(req)
  );

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
