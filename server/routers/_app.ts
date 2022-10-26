import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { donationPageRouter } from "./donationPage";

export const appRouter = router({
  profile: profileRouter,
  donationPage: donationPageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
