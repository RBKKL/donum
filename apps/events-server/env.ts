import { envsafe, str, port, url } from "envsafe";

export const env = envsafe({
  EVENTS_SERVER_HOST: str({
    default: "localhost",
    desc: "The host the app is running on",
    example: "0.0.0.0",
  }),
  PORT: port({
    default: 8000,
    desc: "The port the app is running on",
    example: 8000,
  }),
  DATABASE_URL: url({
    devDefault: "postgres://postgres:postgres@localhost:5432/postgres",
  }),
  EVENTS_SERVER_AUTH_TOKEN: str({
    devDefault: "secret-auth-token",
  }),
  INFURA_ID: str({
    input: process.env.NEXT_PUBLIC_INFURA_ID,
  }),
});
