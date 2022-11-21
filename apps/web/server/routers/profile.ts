import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME } from "@server/storage";
import {
  EditSchema,
  NicknameFormat,
  AddressFormat,
} from "@server/inputSchemas";
import { uploadImage, removeImage } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@donum/prisma";
import { getDefaultProfile, getProfileAvatarUrl } from "@lib/profile";

export const profileRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const address = ctx.session.user.name || "";
    const profile = await ctx.prisma.profile.findFirst({
      where: { address },
    });

    if (!profile) {
      return getDefaultProfile(address);
    }

    return {
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: profile?.avatarFilename,
      // avatarUrl: getProfileAvatarUrl(
      //   profile.address,
      //   profile.avatarFilename,
      //   await ctx.buckets.from(AVATARS_BUCKET_NAME)
      // ),
      minShowAmount: profile.minShowAmount.toString(),
    };
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

      return {
        address: profile.address,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: profile?.avatarFilename,
        // avatarUrl: getProfileAvatarUrl(
        //   profile.address,
        //   profile.avatarFilename,
        //   await ctx.buckets.from(AVATARS_BUCKET_NAME)
        // ),
        minShowAmount: profile.minShowAmount.toString(),
      };
    }),
  byAddress: publicProcedure
    .input(z.object({ address: AddressFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { address: input.address },
      });
      if (!profile) {
        return getDefaultProfile(input.address);
      }

      return {
        address: profile.address,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: profile?.avatarFilename,
        // avatarUrl: getProfileAvatarUrl(
        //   profile.address,
        //   profile.avatarFilename,
        //   await ctx.buckets.from(AVATARS_BUCKET_NAME)
        // ),
        minShowAmount: profile.minShowAmount.toString(),
      };
    }),
  edit: protectedProcedure
    .input(EditSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: make this endpoint create profile if doesn't exist
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

      const avatarPublicUrl =
        input.avatarUrl || getDefaultProfile(profile.address).avatarUrl;

      profile = await ctx.prisma.profile.update({
        where: { address: input.address },
        data: {
          nickname: profile.nickname,
          description: profile.description,
          avatarFilename: input.avatarUrl,
          minShowAmount: profile.minShowAmount,
        },
      });

      return {
        address: profile.address,
        nickname: profile?.nickname,
        description: profile?.description,
        avatarUrl: avatarPublicUrl,
        minShowAmount: profile.minShowAmount.toString(),
      };
    }),
});
