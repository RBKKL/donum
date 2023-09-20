import { z } from "zod";
import SuperJSON from "superjson";
import type {
  ChangeSettingsEvent,
  ChangeSettingsEventData,
} from "@donum/shared/events";
import { TRPCError } from "@trpc/server";
import type { Prisma, Profile as ProfileDb } from "@donum/prisma";
import { isEthAddress } from "@donum/shared/helpers";
import type {
  PartialExcept,
  RemoveUndefinedOrNull,
} from "@donum/shared/type-utils";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_AVATAR_URL,
  DEFAULT_NOTIFICATION_IMAGE_URL,
  DEFAULT_NOTIFICATION_SOUND_URL,
  DEFAULT_MIN_SHOW_AMOUNT,
} from "@donum/shared/default-values";
import { protectedProcedure, publicProcedure, createRouter } from "../trpc";
import {
  AddressFormat,
  DescriptionFormat,
  NicknameFormat,
  AvatarUrlFormat,
  AmountFormat,
  SoundUrlFormat,
  NotificationDurationFormat,
} from "../input-formats";

export type Profile = PartialExcept<Omit<ProfileDb, "id">, "address">;
export type PopulatedProfile = RemoveUndefinedOrNull<Profile>;

const populateProfileWithDefaultValues = (
  profile: Profile
): PopulatedProfile => {
  return {
    address: profile.address,
    nickname: profile.nickname ?? "",
    avatarUrl: profile.avatarUrl || DEFAULT_AVATAR_URL,
    description: profile.description ?? "",
    minShowAmount: profile.minShowAmount ?? DEFAULT_MIN_SHOW_AMOUNT,
    notificationDuration:
      profile.notificationDuration ?? DEFAULT_ALERT_DURATION,
    notificationImageUrl:
      profile.notificationImageUrl || DEFAULT_NOTIFICATION_IMAGE_URL,
    notificationSoundUrl:
      profile.notificationSoundUrl || DEFAULT_NOTIFICATION_SOUND_URL,
  };
};

const isNicknameAvailable = async (
  prisma: Prisma,
  input: {
    address: string;
    nickname: string;
  }
) => {
  if (isEthAddress(input.nickname)) {
    return false;
  }

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

const getPopulatedProfileByAddress = async (
  prisma: Prisma,
  input: {
    address: string;
  }
): Promise<PopulatedProfile> => {
  const profileDb = await prisma.profile.findFirst({
    where: { address: input.address },
  });

  if (!profileDb) {
    return populateProfileWithDefaultValues({ address: input.address });
  }

  return populateProfileWithDefaultValues(profileDb);
};

const getPopulatedProfileByNickname = async (
  prisma: Prisma,
  input: {
    nickname: string;
  }
): Promise<PopulatedProfile | null> => {
  const profileDb = await prisma.profile.findFirst({
    where: { nickname: input.nickname },
  });

  if (!profileDb) {
    return null;
  }

  return populateProfileWithDefaultValues(profileDb);
};

export const getPopulatedProfileByAddressOrNickname = async (
  prisma: Prisma,
  input: {
    addressOrNickname: string;
  }
): Promise<PopulatedProfile | null> => {
  const isAddress = isEthAddress(input.addressOrNickname);
  const profile = isAddress
    ? await getPopulatedProfileByAddress(prisma, {
        address: input.addressOrNickname,
      })
    : await getPopulatedProfileByNickname(prisma, {
        nickname: input.addressOrNickname,
      });

  return profile;
};

export const profileRouter = createRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    return getPopulatedProfileByAddress(ctx.prisma, {
      address: ctx.session.user.address,
    });
  }),
  byNickname: publicProcedure
    .input(z.object({ nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      const populatedProfile = await getPopulatedProfileByNickname(
        ctx.prisma,
        input
      );

      if (!populatedProfile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such nickname",
        });
      }

      return populatedProfile;
    }),
  byAddress: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      return getPopulatedProfileByAddress(ctx.prisma, input);
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
      let profileDb = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });

      const updatedData = profileDb ?? ({} as Profile);

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

      profileDb = await ctx.prisma.profile.upsert({
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
          notificationImageUrl: profileDb.notificationImageUrl,
          notificationSoundUrl: profileDb.notificationSoundUrl,
          notificationDuration: profileDb.notificationDuration,
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

      return populateProfileWithDefaultValues(profileDb);
    }),
  isNicknameAvailable: publicProcedure
    .input(z.object({ address: AddressFormat, nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      return isNicknameAvailable(ctx.prisma, input);
    }),
  getNotificationSettings: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await getPopulatedProfileByAddress(ctx.prisma, input);

      const notificationSettings: ChangeSettingsEventData = {
        notificationDuration: profile.notificationDuration,
        notificationImageUrl: profile.notificationImageUrl,
        notificationSoundUrl: profile.notificationSoundUrl,
      };

      return notificationSettings;
    }),
  getMinShowAmount: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await getPopulatedProfileByAddress(ctx.prisma, input);

      return profile.minShowAmount;
    }),
});
