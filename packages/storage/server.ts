// NOTE: init browser and server clients in seperate files to avoid server code being bundled in the browser
import { createStorageClient } from ".";

if (typeof window !== "undefined") {
  throw new Error("This should only be incldued on the server");
}

// TODO: use envsafe here
export const serverEnv = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
};

export const serverStorageClient = createStorageClient(
  serverEnv.SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY
);
