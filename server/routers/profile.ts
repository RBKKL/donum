import { z } from "zod";
import { router, publicProcedure } from "@server/trpc";

export const profileRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.profile.findMany();
  }),
  byNickname: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });
    }),
  byAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });
    }),
  add: publicProcedure
    .input(
      z.object({
        nickname: z.string(),
        address: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.create({
        data: input,
      });

      return profile;
    }),
  addDescription: publicProcedure
    .input(z.object({ address: z.string(), description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.profile.update({
        where: { address: input.address },
        data: {
          description: input.description,
        },
      });
    }),
});
