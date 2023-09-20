// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "@donum/prisma";
import { serverStorageClient } from "@lib/storage/server";
import { Session, getServerSession } from "next-auth";
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
    storage: serverStorageClient,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerSession(req, res, getAuthOptions(req));

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
