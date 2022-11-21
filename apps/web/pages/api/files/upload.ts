import fs from "fs";
// import { Writable } from "stream";
import formidable, { Options } from "formidable";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { getUploadConfig } from "@lib/files";
import { buckets } from "@server/storage";

// promisify formidable
function parseForm(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<formidable.File> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept(files.file as formidable.File);
    });
  });
}

// const fileConsumer = <T = unknown>(acc: T[]) => {
//   const writable = new Writable({
//     write: (chunk, _enc, next) => {
//       acc.push(chunk);
//       next();
//     },
//   });

//   return writable;
// };

export default async function getUploadAvatarUrl(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id;
  if (typeof id !== "string") {
    res.status(400).send("Invalid id");
    return;
  }

  let uploadConfig: Options;
  let bucketName: string;
  try {
    const config = await getUploadConfig(id);
    uploadConfig = config.options;
    bucketName = config.bucket;
  } catch (err) {
    res.status(400).send("Invalid id");
    return;
  }

  try {
    // const chunks: never[] = [];
    const file = await parseForm(req, {
      ...uploadConfig,
      // TODO: fix this
      // fileWriteStreamHandler: () => fileConsumer(chunks),
    });
    const fileBuffer = fs.readFileSync(file.filepath);
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
    // handle errors
    console.error(e);
    res.status(500).send("Error uploading image");
  }
}

// and don't forget
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
