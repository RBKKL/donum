import { protectedProcedure, router } from "@server/trpc";
import { serverEnv } from "@env/server";
import {
  AddressFormat,
  MessageFormat,
  AmountFormat,
  NicknameFormat,
} from "@server/input-formats";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_TEST_DONATION } from "@donum/shared/constants";

export const donationRouter = router({
  sendTestDonation: protectedProcedure
    .input(
      z
        .object({
          from: NicknameFormat.optional(),
          to: AddressFormat,
          amount: AmountFormat,
          message: MessageFormat.optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const address = ctx.session.user.name!; // protectedProcedure always returns existing user
      const donation = input || { ...DEFAULT_TEST_DONATION, to: address };

      const response = await fetch(`${serverEnv.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        headers: {
          Authorization: serverEnv.EVENT_SECRET,
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
