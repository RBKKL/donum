import {
  // httpBatchLink,
  httpLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import type { AppRouter } from "@server/routers/_app";
// import { browserEnv } from "@env/browser";

// const getBaseUrl = () => {
//   if (typeof window !== "undefined") return ""; // browser should use relative url
//   return browserEnv.WEBAPP_BASE_URL;
// };

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        // httpBatchLink({
        //   url: `${getBaseUrl()}/api/trpc`,
        // }),
        httpLink({
          url: `/api/trpc`,
        }),
      ],
    };
  },
  ssr: true,
});
