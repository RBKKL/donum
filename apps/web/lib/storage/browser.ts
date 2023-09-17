// NOTE: init browser and server clients in seperate files to avoid server code being bundled in the browser
import { createStorageClient } from ".";
import { browserEnv } from "@env/browser";

export const browserStorageClient = createStorageClient(
  browserEnv.SUPABASE_URL,
  browserEnv.SUPABASE_ANON_KEY
);
