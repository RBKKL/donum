import { router } from "./trpc";
import { profileRouter } from "./routers/profile";
import { uploadsRouter } from "./routers/uploads";
import { donationRouter } from "./routers/donation";

export const appRouter = router({
  profile: profileRouter,
  uploads: uploadsRouter,
  donation: donationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
