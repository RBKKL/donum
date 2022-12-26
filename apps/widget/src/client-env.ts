export const clientEnv = {
  EVENTS_SERVER_URL: import.meta.env.VITE_EVENTS_SERVER_URL ?? "localhost:8000",
} as const;
