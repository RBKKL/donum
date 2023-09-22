import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter, createContext } from "@donum/trpc/server";
import { serverEnv } from "~/env/server";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError:
    serverEnv.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error}`);
        }
      : undefined,
});
