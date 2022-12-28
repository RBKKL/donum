import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@server/routers/_app";
import { createContext } from "@server/context";
import { serverEnv } from "@env/server";

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
  batching: {
    enabled: true,
  },
});
