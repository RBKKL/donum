import { protectedProcedure, router } from "@server/trpc";
import { serverEnv } from "@env/server";
import { DonationSchema } from "@server/inputSchemas";

export const donationRouter = router({
  sendTestDonation: protectedProcedure
    .input(DonationSchema)
    .mutation(async ({ input }) => {
      fetch(`${serverEnv.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        body: JSON.stringify(input),
      });
    }),
});
