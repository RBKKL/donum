import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { uploadsRouter } from "./uploads";
import { donationRouter } from "./donation";

export const appRouter = router({
  profile: profileRouter,
  uploads: uploadsRouter,
  donation: donationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
