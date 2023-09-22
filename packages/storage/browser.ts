// NOTE: init browser and server clients in seperate files to avoid server code being bundled in the browser
import { createStorageClient } from ".";

// TODO: use envsafe here
export const browserEnv = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
};

export const browserStorageClient = createStorageClient(
  browserEnv.SUPABASE_URL,
  browserEnv.SUPABASE_ANON_KEY
);
