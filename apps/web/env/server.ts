export const serverEnv = {
  VERCEL_URL: process.env.VERCEL_URL ?? "",
  PORT: process.env.PORT ?? "3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  STORAGE_URL: process.env.STORAGE_URL ?? "",
  SERVICE_KEY: process.env.SERVICE_KEY ?? "",
};
