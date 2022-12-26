export const clientEnv = {
  EVENTS_SERVER_URL:
    import.meta.env.EVENTS_SERVER_URL || "http://localhost:8000",
} as const;
