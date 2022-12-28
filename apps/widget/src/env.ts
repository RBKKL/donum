import { envsafe, url } from "envsafe";

export const env = envsafe(
  {
    EVENTS_SERVER_URL: url({
      devDefault: "localhost:8000",
      input: import.meta.env.VITE_EVENTS_SERVER_URL,
    }),
  },
  {
    env: import.meta.env,
  }
);
