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
  add: publicProcedure
    .input(z.object({ nickname: z.string(), bio: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.create({
        data: { nickname: input.nickname, bio: input.bio },
      });

      return profile;
    }),
  addDescription: publicProcedure
    .input(z.object({ nickname: z.string(), description: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.profile.update({
        where: { nickname: input.nickname },
        data: {
          description: input.description,
        },
      });
    }),
});
