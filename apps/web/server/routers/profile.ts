import { z } from "zod";
import SuperJSON from "superjson";
import type { ChangeSettingsEvent } from "@donum/shared/events";
import { protectedProcedure, publicProcedure, router } from "@server/trpc";
import {
  AddressFormat,
  DescriptionFormat,
  NicknameFormat,
  AvatarUrlFormat,
  AmountFormat,
  SoundUrlFormat,
  NotificationDurationFormat,
} from "@server/input-formats";
import { TRPCError } from "@trpc/server";
import { populateProfileWithDefaultValues, Profile } from "@lib/profile";
import type { Prisma } from "@donum/prisma";

const isNicknameAvailable = async (
  prisma: Prisma,
  input: {
    address: string;
    nickname: string;
  }
) => {
  const isReservedWord = await prisma.reservedWords.findUnique({
    where: { word: input.nickname },
  });
  if (isReservedWord) {
    return false;
  }

  const profileWithSameNickname = await prisma.profile.findFirst({
    where: { nickname: input.nickname },
  });

  const isAvailable =
    !profileWithSameNickname ||
    profileWithSameNickname.address === input.address;

  return isAvailable;
};

export const profileRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const address = ctx.session.user.address!; // protectedProcedure always returns existing user
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
        notificationDuration: NotificationDurationFormat.optional(),
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
        const isAvailable = await isNicknameAvailable(ctx.prisma, {
          address: input.address,
          nickname: input.nickname,
        });
        if (!isAvailable) {
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
        updatedData.minShowAmount = input.minShowAmount;
      }

      if (input.notificationDuration) {
        updatedData.notificationDuration = input.notificationDuration;
      }

      profile = await ctx.prisma.profile.upsert({
        where: { address: input.address },
        update: {
          nickname: updatedData.nickname,
          description: updatedData.description,
          avatarUrl: input.avatarUrl,
          minShowAmount: updatedData.minShowAmount,
          notificationDuration: updatedData.notificationDuration,
          notificationImageUrl: input.notificationImageUrl,
          notificationSoundUrl: input.notificationSoundUrl,
        },
        create: {
          address: input.address,
          nickname: updatedData.nickname,
          description: updatedData.description,
          avatarUrl: input.avatarUrl,
          minShowAmount: updatedData.minShowAmount,
          notificationDuration: updatedData.notificationDuration,
          notificationImageUrl: input.notificationImageUrl,
          notificationSoundUrl: input.notificationSoundUrl,
        },
      });

      const data: ChangeSettingsEvent = {
        to: input.address,
        data: {
          notificationImageUrl: profile.notificationImageUrl,
          notificationSoundUrl: profile.notificationSoundUrl,
          notificationDuration: profile.notificationDuration,
        },
      };

      const response = await fetch(
        `${ctx.env.EVENTS_SERVER_URL}/change-settings`,
        {
          method: "POST",
          headers: {
            Authorization: ctx.env.EVENTS_SERVER_AUTH_TOKEN,
          },
          body: SuperJSON.stringify(data),
        }
      );

      if (response.status !== 200) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Wrong secret",
        });
      }

      return populateProfileWithDefaultValues(profile);
    }),
  isNicknameAvailable: publicProcedure
    .input(z.object({ address: AddressFormat, nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      return isNicknameAvailable(ctx.prisma, input);
    }),
});
