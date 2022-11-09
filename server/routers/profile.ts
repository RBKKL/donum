import { z } from "zod";
import { publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import { AddSchema, EditSchema, NicknameFormat } from "@server/inputSchemas";
import { uploadImage, removeImage } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";
import { uuid4 } from "@sentry/utils";

export const profileRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const avatarsMap = new Map();
    const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
    const { data: avatarFiles, error } = await avatarsBucket.list();

    if (error) {
      console.error("Error getting avatars list from bucket");
      console.error(error);
    } else {
      avatarFiles.map((avatarFile) => {
        const avatarUrl = avatarsBucket.getPublicUrl(avatarFile.name).data
          .publicUrl;
        avatarsMap.set(avatarFile.name, avatarUrl);
      });
    }

    const allProfiles = await ctx.prisma.profile.findMany();
    return allProfiles.map((profile) => ({
      wallet: profile.wallet,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarsMap.get(profile.avatarFilename) ?? "",
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
        if (error) {
          console.error("Unable to get items from avatars bucket");
          console.error(error);
        } else {
          const avatarFile = avatarFiles.filter(
            (avatarFile) => avatarFile.name === profile.avatarFilename
          )[0];
          avatarUrl = avatarsBucket.getPublicUrl(avatarFile.name).data
            .publicUrl;
        }
      }

      return {
        wallet: profile.wallet,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: avatarUrl,
      };
    }),
  add: publicProcedure.input(AddSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { wallet: input.wallet },
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
        wallet: input.wallet,
        nickname: input.nickname,
        description: input.description,
        avatarFilename: avatarFilename,
      },
    });

    return {
      wallet: profile.wallet,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarPublicUrl,
    };
  }),
  edit: publicProcedure.input(EditSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { wallet: input.wallet },
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

    if (input.description) {
      profile.description = input.description;
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
      where: { wallet: input.wallet },
      data: {
        nickname: profile.nickname,
        description: profile.description,
        avatarFilename: newAvatarFilename,
      },
    });

    return {
      wallet: profile.wallet,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarPublicUrl,
    };
  }),
});
