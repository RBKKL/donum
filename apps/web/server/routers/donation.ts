import { protectedProcedure, router } from "@server/trpc";
import { serverEnv } from "@env/server";
import {
  AddressFormat,
  HexStringFormat,
  MessageFormat,
  NicknameFormat,
} from "@server/input-formats";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_TEST_DONATION } from "@donum/shared/constants";

export const donationRouter = router({
  sendTestDonation: protectedProcedure
    .input(
      z.object({
        from: NicknameFormat.optional(),
        to: AddressFormat,
        amount: HexStringFormat,
        message: MessageFormat.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const address = ctx.session.user.name!; // protectedProcedure always returns existing user
      if (address !== input.to) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't send test donations to someone else",
        });
      }

      const response = await fetch(`${serverEnv.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        headers: {
          Authorization: serverEnv.EVENT_SECRET,
        },
        body: JSON.stringify(input),
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Wrong secret",
        });
      }
    }),
  sendDefaultTestDonation: protectedProcedure
    .input(z.object({ address: AddressFormat }))
    .mutation(async ({ ctx, input }) => {
      const address = ctx.session.user.name!; // protectedProcedure always returns existing user
      if (address !== input.address) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't send test donations to someone else",
        });
      }

      const response = await fetch(`${serverEnv.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        headers: {
          Authorization: serverEnv.EVENT_SECRET,
        },
        body: JSON.stringify({
          ...DEFAULT_TEST_DONATION,
          to: address,
        }),
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Wrong secret",
        });
      }
    }),
});
