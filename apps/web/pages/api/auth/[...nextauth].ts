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
import { prisma } from "@donum/prisma";

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
    signIn: async ({ user }) => {
      const address = user.id;
      if (!(await prisma.profile.findFirst({ where: { address } }))) {
        await prisma.profile.create({ data: { address } });
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth",
  },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  await NextAuth(req, res, getAuthOptions(req));

export default handler;
