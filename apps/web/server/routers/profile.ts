import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import {
  EditSchema,
  NicknameFormat,
  AddressFormat,
} from "@server/inputSchemas";
import { uploadImage, removeImage } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";
import { uuid4 } from "@sentry/utils";
import { Prisma } from "@prisma/client";

export const profileRouter = router({
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
        minShowAmount: profile.minShowAmount.toString(),
      };
    }),
  // TODO: discuss if byAddress endpoint should be in production router
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

      if (input.minShowAmount) {
        profile.minShowAmount = new Prisma.Decimal(input.minShowAmount);
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
