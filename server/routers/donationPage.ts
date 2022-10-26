import { z } from "zod";
import { router, publicProcedure } from "@server/trpc";

export const donationPageRouter = router({
  byAddress: publicProcedure
    .input(z.object({ address: z.string().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.donationPage.findFirst({
        where: { address: input.address },
      });
    }),
  edit: publicProcedure
    .input(z.object({ address: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const donationPage = await ctx.prisma.donationPage.upsert({
        where: { address: input.address },
        create: { address: input.address, description: input.description },
        update: { description: input.description },
      });

      return donationPage;
    }),
});
