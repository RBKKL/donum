import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@donum/trpc";

export const apiClient = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      // TODO: use env variable
      url: "http://localhost:3000/api/trpc",
    }),
    // TODO: add auth
  ],
});
