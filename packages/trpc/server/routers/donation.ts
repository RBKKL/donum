import { TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { z } from "zod";
import { DEFAULT_TEST_DONATION } from "@donum/shared/default-values";
import type { NewDonationEvent } from "@donum/shared/events";
import { AmountFormat, MessageFormat, NicknameFormat } from "../input-formats";
import { createRouter, protectedProcedure } from "../trpc";

export const donationRouter = createRouter({
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
      const address = ctx.session.user.address;
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
