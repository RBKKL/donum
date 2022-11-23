import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { devOnlyProfileRouter } from "./devOnlyProfile";
import { uploadsRouter } from "./uploads";

export const appRouter = router({
  profile: profileRouter,
  devOnlyProfile: devOnlyProfileRouter,
  uploads: uploadsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
