import { envsafe, str, url } from "envsafe";

if (typeof window !== "undefined") {
  throw new Error("This should only be incldued on the server");
}

export const serverEnv = envsafe({
  WIDGET_BASE_URL: url({
    devDefault: "localhost:5173",
    input: process.env.NEXT_PUBLIC_WIDGET_BASE_URL,
  }),
  INFURA_ID: str({
    input: process.env.NEXT_PUBLIC_INFURA_ID,
  }),
  WALLETCONNECT_PROJECT_ID: str({
    input: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  }),
  WEBAPP_BASE_URL: url({
    devDefault: "http://localhost:3000",
    input: (() => {
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
      }

      return process.env.NEXT_PUBLIC_WEBAPP_BASE_URL;
    })(),
  }),
  SUPABASE_URL: url({
    devDefault: "http://localhost:54321",
    input: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }),
  SUPABASE_ANON_KEY: str({
    input: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }),
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "test", "production"],
  }),
  SUPABASE_SERVICE_ROLE_KEY: str({
    devDefault:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAc",
  }),
  NEXTAUTH_SECRET: str({
    devDefault: "secret",
  }),
  POSTGRES_URL: url({
    devDefault: "postgres://postgres:postgres@localhost:54322/postgres",
  }),
  POSTGRES_URL_NON_POOLING: url({
    devDefault: "postgres://postgres:postgres@localhost:54322/postgres",
  }),
  EVENTS_SERVER_URL: url({
    devDefault: "http://localhost:8000",
    input: process.env.VITE_EVENTS_SERVER_URL,
  }),
  EVENTS_SERVER_AUTH_TOKEN: str({
    devDefault: "secret-auth-token",
  }),
});
