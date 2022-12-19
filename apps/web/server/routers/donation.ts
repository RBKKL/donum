import { protectedProcedure, router } from "@server/trpc";
import { serverEnv } from "@env/server";
import {
  MessageFormat,
  AmountFormat,
  NicknameFormat,
  AddressFormat,
} from "@server/input-formats";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_TEST_DONATION } from "@donum/shared/constants";

export const donationRouter = router({
  sendTestDonation: protectedProcedure
    .input(
      z
        .object({
          amount: AmountFormat,
          from: NicknameFormat.or(AddressFormat).optional(),
          message: MessageFormat.optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const address = ctx.session.user.name!; // protectedProcedure always returns existing user
      const donation = { to: address, ...DEFAULT_TEST_DONATION, ...input };

      const response = await fetch(`${serverEnv.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        headers: {
          Authorization: serverEnv.EVENTS_SERVER_AUTH_TOKEN,
        },
        body: JSON.stringify(donation),
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Wrong secret",
        });
      }
    }),
});
