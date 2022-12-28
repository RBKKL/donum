import { envsafe, url, str } from "envsafe";

export const browserEnv = envsafe({
  WIDGET_BASE_URL: url({
    devDefault: "localhost:5173",
    input: process.env.NEXT_PUBLIC_WIDGET_BASE_URL,
  }),
  INFURA_ID: str({
    input: process.env.NEXT_PUBLIC_INFURA_ID,
  }),
  WEBAPP_BASE_URL: url({
    devDefault: "http://localhost:3000",
    input: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_WEBAPP_BASE_URL,
  }),
});
