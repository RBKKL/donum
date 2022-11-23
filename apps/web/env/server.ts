export const serverEnv = {
  VERCEL_URL: process.env.VERCEL_URL ?? "",
  PORT: process.env.PORT ?? "3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  STORAGE_URL: process.env.STORAGE_URL ?? "",
  SERVICE_KEY: process.env.SERVICE_KEY ?? "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "",
  WEBAPP_BASE_URL: process.env.WEBAPP_BASE_URL ?? "",
  REDIS_URL: process.env.REDIS_URL ?? "",
  EVENTS_SERVER_URL: process.env.EVENTS_SERVER_URL ?? "",
  EVENT_SECRET: process.env.EVENT_SECRET ?? "",
};
