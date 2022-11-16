import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { devOnlyProfileRouter } from "@server/routers/devOnlyProfile";

export const appRouter = router({
  profile: profileRouter,
  devOnlyProfile: devOnlyProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
