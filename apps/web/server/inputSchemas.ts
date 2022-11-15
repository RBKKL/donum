import { z } from "zod";
import { DESCRIPTION_MAX_LENGTH, NICKNAME_MAX_LENGTH } from "shared/constants";
import { ethers } from "ethers";
import { BN } from "bn.js";

export const NicknameFormat = z.string().max(NICKNAME_MAX_LENGTH);
export const AddressFormat = z
  .string()
  .refine((val) => ethers.utils.isAddress(val), {
    message: "String must be in wallet format",
  });
export const DescriptionFormat = z.string().max(DESCRIPTION_MAX_LENGTH);
export const AvatarFormat = z.string().startsWith("data:image/");
const MinimalDonationShowFormat = z.string().transform((val, ctx) => {
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

export const AddSchema = z.object({
  address: AddressFormat,
  nickname: NicknameFormat,
  description: DescriptionFormat.optional(),
  avatar: AvatarFormat.optional(),
});

export const EditSchema = z.object({
  address: AddressFormat,
  nickname: NicknameFormat.optional(),
  description: DescriptionFormat.optional(),
  avatar: AvatarFormat.optional(),
  minimalDonationShow: MinimalDonationShowFormat.optional(),
});