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

export const getAuthOptions: (
  req: NextApiRequest | GetServerSidePropsContext["req"]
) => NextAuthOptions = (req) => ({
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
          const nextAuthUrl = new URL(serverEnv.NEXTAUTH_URL || "");

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
      if (!session.user) {
        return session;
      }

      session.user.name = token.sub;
      return session;
    },
  },
});

export default async (req: NextApiRequest, res: NextApiResponse) =>
  await NextAuth(req, res, getAuthOptions(req));
