// NOTE: init browser and server clients in seperate files to avoid server code being bundled in the browser
import { createStorageClient } from ".";
import { serverEnv } from "@env/server";

export const serverStorageClient = createStorageClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY
);
