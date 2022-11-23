import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@server/trpc";
import {
  NicknameFormat,
  AddressFormat,
  DescriptionFormat,
  AmountFormat,
} from "@server/input-formats";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@donum/prisma";
import { populateProfileWithDefaultValues } from "@lib/profile";

export const profileRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const address = ctx.session.user.name!; // protectedProcedure always returns existing user
    const profile = await ctx.prisma.profile.findFirst({
      where: { address },
    });

    if (!profile) {
      return populateProfileWithDefaultValues({ address });
    }

    return populateProfileWithDefaultValues(profile);
  }),
  byNickname: publicProcedure
    .input(z.object({ nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });

      if (!profile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such nickname",
        });
      }

      return populateProfileWithDefaultValues(profile);
    }),
  byAddress: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });
      if (!profile) {
        return populateProfileWithDefaultValues({ address: input.address });
      }

      return populateProfileWithDefaultValues(profile);
    }),
  edit: protectedProcedure
    .input(
      z.object({
        address: AddressFormat,
        nickname: NicknameFormat.optional(),
        description: DescriptionFormat.optional(),
        avatarUrl: z.string().url().optional(),
        minShowAmount: AmountFormat.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: make this endpoint create profile if it doesn't exist
      let profile = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });

      if (!profile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "No account connected with this wallet, create account first",
        });
      }

      if (input.address !== ctx.session.user.name) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't edit someone else's profile",
        });
      }

      if (input.nickname === "") {
        profile.nickname = null;
      }
      if (input.nickname) {
        const sameNicknameCheck = await ctx.prisma.profile.findFirst({
          where: { nickname: input.nickname },
        });
        if (sameNicknameCheck && sameNicknameCheck.address !== input.address) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This nickname is already used",
          });
        }

        profile.nickname = input.nickname;
      }

      if (input.description || input.description === "") {
        profile.description = input.description;
      }

      if (input.minShowAmount) {
        profile.minShowAmount = new Prisma.Decimal(input.minShowAmount);
      }

      profile = await ctx.prisma.profile.update({
        where: { address: input.address },
        data: {
          nickname: profile.nickname,
          description: profile.description,
          avatarUrl: input.avatarUrl,
          minShowAmount: profile.minShowAmount,
        },
      });

      return populateProfileWithDefaultValues(profile);
    }),
});
