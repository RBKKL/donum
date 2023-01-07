import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { JWT } from "next-auth/jwt";
import { serverEnv } from "@env/server";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@donum/prisma/index";

type GetAuthOptionsFn = (
  req: NextApiRequest | GetServerSidePropsContext["req"]
) => NextAuthOptions;

declare module "next-auth" {
  interface User {
    address?: string;
  }

  interface Session {
    user: User;
  }
}

export const getAuthOptions: GetAuthOptionsFn = (req) => ({
  adapter: PrismaAdapter(prisma),
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
          const nextAuthUrl = new URL(serverEnv.NEXTAUTH_URL);

          const result = await message.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          return result.success ? { id: message.address } : null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: serverEnv.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (!session.user || !token.sub) {
        return session;
      }

      session.user.address = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  await NextAuth(req, res, getAuthOptions(req));

export default handler;
