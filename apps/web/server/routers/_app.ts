import { router } from "@server/trpc";
import { profileRouter } from "./profile";
import { uploadsRouter } from "./uploads";

export const appRouter = router({
  profile: profileRouter,
  uploads: uploadsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
