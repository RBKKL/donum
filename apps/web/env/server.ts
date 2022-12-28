import { envsafe, str, url } from "envsafe";
import { browserEnv } from "./browser";

if (typeof window !== "undefined") {
  throw new Error("This should only be incldued on the server");
}

export const serverEnv = {
  ...browserEnv,
  ...envsafe({
    NODE_ENV: str({
      devDefault: "development",
      choices: ["development", "test", "production"],
    }),
    SUPABASE_STORAGE_URL: url({
      devDefault: "http://localhost:54321/storage/v1",
    }),
    SUPABASE_SERVICE_KEY: str({
      devDefault:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAc",
    }),
    NEXTAUTH_URL: url({
      devDefault: "http://localhost:3000",
      input: process.env.NEXT_PUBLIC_WEBAPP_BASE_URL,
    }),
    NEXTAUTH_SECRET: str({
      devDefault: "secret",
    }),
    DATABASE_URL: url({
      devDefault: "postgres://postgres:postgres@localhost:5432/postgres",
    }),
    EVENTS_SERVER_URL: url({
      devDefault: "http://localhost:8000",
      input: process.env.VITE_EVENTS_SERVER_URL,
    }),
    EVENTS_SERVER_AUTH_TOKEN: str({
      devDefault: "secret-auth-token",
    }),
  }),
} as const;
