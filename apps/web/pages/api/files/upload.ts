import fs from "fs";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { getUploadConfig } from "@server/uploads";
import { buckets } from "@server/storage";

// promisify formidable
const parseForm = (
  req: NextApiRequest,
  opts?: formidable.Options
): Promise<formidable.File> => {
  return new Promise((resolve, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return resolve(files["file"] as formidable.File); // this should be the same as the name in the client
    });
  });
};

export default async function upload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  if (typeof id !== "string") {
    res.status(400).send("Invalid id");
    return;
  }

  let uploadOptions: formidable.Options;
  let bucketName: string;
  try {
    const config = await getUploadConfig(id);
    uploadOptions = config.options;
    bucketName = config.bucket;
  } catch (err) {
    res.status(400).send("Invalid id");
    return;
  }

  try {
    const file = await parseForm(req, {
      ...uploadOptions,
    });
    const fileBuffer = fs.readFileSync(file.filepath); // TODO: use streams
    const filename = file.newFilename;

    // TODO: remove previous avatar
    const bucket = await buckets.from(bucketName);
    const { error: uploadError } = await bucket.upload(filename, fileBuffer, {
      upsert: true,
    });

    if (uploadError) {
      throw uploadError;
    }

    res.status(200).send(bucket.getPublicUrl(filename).data.publicUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send("Error uploading file");
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
