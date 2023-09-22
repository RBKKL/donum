import { donationRouter } from "./routers/donation";
import { profileRouter } from "./routers/profile";
import { uploadsRouter } from "./routers/uploads";
import { createRouter } from "./trpc";

export const appRouter = createRouter({
  profile: profileRouter,
  uploads: uploadsRouter,
  donation: donationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
