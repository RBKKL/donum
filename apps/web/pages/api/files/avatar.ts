import type { NextApiRequest, NextApiResponse } from "next";
import { generateUploadAvatarUrl } from "@lib/files";

export default async function getUploadAvatarUrl(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uploadUrl = await generateUploadAvatarUrl();
  res.status(200).send(uploadUrl);
}
