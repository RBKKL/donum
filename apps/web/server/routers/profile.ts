import { z } from "zod";
import { publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import {
  AddSchema,
  EditSchema,
  NicknameFormat,
  AddressFormat,
} from "@server/inputSchemas";
import { uploadImage, removeImage } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";
import { uuid4 } from "@sentry/utils";
import { Prisma } from "@prisma/client";

export const profileRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const avatarsMap = new Map();
    const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
    const { data: avatarFiles, error } = await avatarsBucket.list();

    // data === null only when error !== null and vice versa
    if (avatarFiles) {
      avatarFiles.map((avatarFile) => {
        const avatarUrl = avatarsBucket.getPublicUrl(avatarFile.name).data
          .publicUrl;
        avatarsMap.set(avatarFile.name, avatarUrl);
      });
    } else {
      console.error("Error getting avatars list from bucket");
      console.error(error);
    }

    const allProfiles = await ctx.prisma.profile.findMany();
    return allProfiles.map((profile) => ({
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarsMap.get(profile.avatarFilename) ?? "",
      minimalDonationShow: profile.minimalDonationShow.toString(),
    }));
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

      let avatarUrl = "";
      if (profile.avatarFilename) {
        const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
        const { data: avatarFiles, error } = await avatarsBucket.list();

        // data === null only when error !== null and vice versa
        if (avatarFiles) {
          const avatarFile = avatarFiles.filter(
            (avatarFile) => avatarFile.name === profile.avatarFilename
          )[0];
          avatarUrl = avatarsBucket.getPublicUrl(avatarFile.name).data
            .publicUrl;
        } else {
          console.error("Unable to get items from avatars bucket");
          console.error(error);
        }
      }

      return {
        address: profile.address,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: avatarUrl,
        minimalDonationShow: profile.minimalDonationShow.toString(),
      };
    }),
  byAddress: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });
      if (!profile) {
        // TODO: remake
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such profile",
        });
      }

      let avatarUrl = "";
      if (profile.avatarFilename) {
        const avatarsBucket = await ctx.buckets.from(AVATARS_BUCKET_NAME);
        avatarUrl = avatarsBucket.getPublicUrl(profile.avatarFilename).data
          .publicUrl;
      }

      return {
        address: profile.address,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: avatarUrl,
        minimalDonationShow: profile.minimalDonationShow.toString(),
      };
    }),
  add: publicProcedure.input(AddSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { address: input.address },
    });
    if (profile) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Account with this wallet is already added",
      });
    }

    let avatarPublicUrl = "";
    let avatarFilename = null;
    if (input.avatar) {
      avatarFilename = uuid4();
      avatarPublicUrl = await uploadImage(
        await ctx.buckets.from(AVATARS_BUCKET_NAME),
        input.avatar,
        avatarFilename
      );
    }

    profile = await ctx.prisma.profile.create({
      data: {
        address: input.address,
        nickname: input.nickname,
        description: input.description,
        avatarFilename: avatarFilename,
      },
    });

    return {
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarPublicUrl,
      minimalDonationShow: profile.minimalDonationShow.toString(),
    };
  }),
  edit: publicProcedure.input(EditSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { address: input.address },
    });

    if (!profile) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No account connected with this wallet, create account first",
      });
    }

    if (input.nickname) {
      const sameNicknameCheck = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });
      if (sameNicknameCheck) {
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

    if (input.minimalDonationShow) {
      profile.minimalDonationShow = new Prisma.Decimal(
        input.minimalDonationShow
      );
    }

    let avatarPublicUrl = "";
    let newAvatarFilename = undefined;
    if (input.avatar) {
      newAvatarFilename = uuid4();
      const avatarsBucket = await ctx.buckets.from(AVATARS_BUCKET_NAME);
      if (profile.avatarFilename) {
        await removeImage(avatarsBucket, profile.avatarFilename);
      }
      avatarPublicUrl = await uploadImage(
        avatarsBucket,
        input.avatar,
        newAvatarFilename
      );
    }

    profile = await ctx.prisma.profile.update({
      where: { address: input.address },
      data: {
        nickname: profile.nickname,
        description: profile.description,
        avatarFilename: newAvatarFilename,
        minimalDonationShow: profile.minimalDonationShow,
      },
    });

    return {
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarPublicUrl,
      minimalDonationShow: profile.minimalDonationShow.toString(),
    };
  }),
});