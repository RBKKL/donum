import { z } from "zod";
import { DESCRIPTION_MAX_LENGTH } from "@donum/shared/constants";
import { ethers } from "ethers";
import { BN } from "bn.js";
import { isCorrectNickname } from "@donum/shared/helpers";

export const NicknameFormat = z
  .string()
  .refine((val) => val === "" || isCorrectNickname(val), {
    message: "Invalid nickname format",
  });

export const AddressFormat = z
  .string()
  .refine((val) => ethers.utils.isAddress(val), {
    message: "String must be in wallet format",
  });

export const DescriptionFormat = z.string().max(DESCRIPTION_MAX_LENGTH);

export const AvatarUrlFormat = z.string().url();

export const MinShowAmountFormat = z.string().transform((val, ctx) => {
  try {
    const valBN = new BN(val);
    if (valBN.isNeg()) {
      throw new Error("Value should not be negative");
    }
    return valBN.toString(10, 78);
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: (e as Error).message,
    });
    return z.NEVER;
  }
});
