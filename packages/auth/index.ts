import type { GetServerSidePropsContext, NextApiRequest } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    address: string; // ethereum address
  }

  interface Session extends DefaultSession {
    user: DefaultSession["user"] &
      User & {
        id: string;
      };
  }
}
export type { Session };

// TODO: replace this with the real env
const serverEnv = {
  NEXTAUTH_SECRET: "secret",
  WEBAPP_BASE_URL: "http://localhost:3000",
} as const;

/**
 * Function to create options for NextAuth.js, which used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
type GetAuthOptionsFn = (
  req: NextApiRequest | GetServerSidePropsContext["req"]
) => NextAuthOptions;

export const getAuthOptions: GetAuthOptionsFn = (req) => ({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  secret: serverEnv.NEXTAUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          address: token.sub,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        message: {},
        signature: {},
      },
      async authorize(credentials) {
        try {
          const message = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );
          const appUrl = new URL(serverEnv.WEBAPP_BASE_URL);
          const result = await message.verify({
            signature: credentials?.signature || "",
            domain: appUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          return result.success
            ? { id: message.address, address: message.address }
            : null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
});

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, getAuthOptions(ctx.req));
};
