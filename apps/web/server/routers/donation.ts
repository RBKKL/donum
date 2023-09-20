import { protectedProcedure, router } from "@server/trpc";
import {
  MessageFormat,
  AmountFormat,
  NicknameFormat,
} from "@server/input-formats";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { DEFAULT_TEST_DONATION } from "@donum/shared/constants";
import type { NewDonationEvent } from "@donum/shared/events";
import SuperJSON from "superjson";

export const donationRouter = router({
  sendTestDonation: protectedProcedure
    .input(
      z
        .object({
          amount: AmountFormat,
          nickname: NicknameFormat.optional(),
          message: MessageFormat.optional(),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      const address = ctx.session.user.address!; // NOTE: protectedProcedure always returns existing user
      const donation: NewDonationEvent = {
        to: address,
        data: {
          ...DEFAULT_TEST_DONATION,
          ...input,
          amount: (input?.amount ?? DEFAULT_TEST_DONATION.amount).toString(),
        },
      };

      const response = await fetch(`${ctx.env.EVENTS_SERVER_URL}/test`, {
        method: "POST",
        headers: {
          Authorization: ctx.env.EVENTS_SERVER_AUTH_TOKEN,
        },
        body: SuperJSON.stringify(donation),
      });

      if (response.status !== 200) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Wrong secret",
        });
      }
    }),
});
