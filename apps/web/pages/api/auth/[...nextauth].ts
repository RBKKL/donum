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
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || "");

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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (!session.user) {
        return session;
      }

      session.user.name = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getAuthOptions(req));
}
