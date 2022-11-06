import { router } from "@server/trpc";
import { profileRouter } from "./profile";

export const appRouter = router({
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
