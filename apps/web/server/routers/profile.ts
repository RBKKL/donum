import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@server/trpc";
import {
  AddressFormat,
  DescriptionFormat,
  NicknameFormat,
  AvatarUrlFormat,
  AmountFormat,
  SoundUrlFormat,
} from "@server/input-formats";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@donum/prisma";
import { populateProfileWithDefaultValues, Profile } from "@lib/profile";

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
        avatarUrl: AvatarUrlFormat.optional(),
        minShowAmount: AmountFormat.optional(),
        notificationImageUrl: AvatarUrlFormat.optional(),
        notificationSoundUrl: SoundUrlFormat.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let profile = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });

      const updatedData = profile ?? ({} as Profile);

      if (input.nickname === "") {
        updatedData.nickname = null;
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

        updatedData.nickname = input.nickname;
      }

      if (input.description || input.description === "") {
        updatedData.description = input.description;
      }

      if (input.minShowAmount) {
        updatedData.minShowAmount = new Prisma.Decimal(input.minShowAmount);
      }

      profile = await ctx.prisma.profile.upsert({
        where: { address: input.address },
        update: {
          nickname: updatedData.nickname,
          description: updatedData.description,
          avatarUrl: input.avatarUrl,
          minShowAmount: updatedData.minShowAmount,
          notificationImageUrl: input.notificationImageUrl,
          notificationSoundUrl: input.notificationSoundUrl,
        },
        create: {
          address: input.address,
          nickname: updatedData.nickname,
          description: updatedData.description,
          avatarUrl: input.avatarUrl,
          minShowAmount: updatedData.minShowAmount,
          notificationImageUrl: input.notificationImageUrl,
          notificationSoundUrl: input.notificationSoundUrl,
        },
      });

      return populateProfileWithDefaultValues(profile);
    }),
  availableNickname: publicProcedure
    .input(z.object({ nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      const isReservedWord = await ctx.prisma.reservedWords.findUnique({
        where: { word: input.nickname },
      });
      if (isReservedWord) {
        return false;
      }

      const profile = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });
      return !profile;
    }),
});
