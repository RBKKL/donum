import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@server/routers/_app";
import { createContext } from "@server/context";
import { serverEnv } from "@env/server";

export const config = {
  api: {
    bodyParser: {
      // A rough approximation for base64 would be that the size of the data is increased to 4/3 of the original
      // + additional request data
      sizeLimit: "14mb" /* ~10mb avatar limit */,
    },
  },
};

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
