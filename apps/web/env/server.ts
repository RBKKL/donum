export const serverEnv = {
  VERCEL_URL: process.env.VERCEL_URL ?? "",
  PORT: process.env.PORT ?? "3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  SUPABASE_STORAGE_URL: process.env.SUPABASE_STORAGE_URL ?? "",
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ?? "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
  WEBAPP_BASE_URL: process.env.WEBAPP_BASE_URL ?? "",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  EVENTS_SERVER_URL: process.env.EVENTS_SERVER_URL ?? "",
  EVENTS_SERVER_AUTH_TOKEN: process.env.EVENTS_SERVER_AUTH_TOKEN ?? "",
};
