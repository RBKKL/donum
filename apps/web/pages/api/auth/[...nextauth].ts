import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { getAuthOptions } from "@donum/auth";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, getAuthOptions(req));

export default handler;
