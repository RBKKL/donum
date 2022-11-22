import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { devOnlyProfileRouter } from "@server/routers/devOnlyProfile";
import { donationRouter } from "@server/routers/donation";

export const appRouter = router({
  profile: profileRouter,
  devOnlyProfile: devOnlyProfileRouter,
  donation: donationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
