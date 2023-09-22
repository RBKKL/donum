import { envsafe, str, url } from "envsafe";

export const browserEnv = envsafe({
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
});
