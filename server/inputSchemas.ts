import { z } from "zod";
import { BIO_MAX_LENGTH, NICKNAME_MAX_LENGTH } from "@lib/constants";
import { ethers } from "ethers";

export const NicknameFormat = z.string().max(NICKNAME_MAX_LENGTH);
export const WalletFormat = z
  .string()
  .refine((val) => ethers.utils.isAddress(val), {
    message: "String must be in wallet format",
  });
export const BioFormat = z.string().max(BIO_MAX_LENGTH);
export const AvatarFormat = z.string().startsWith("data:image/");

export const AddSchema = z.object({
  wallet: WalletFormat,
  nickname: NicknameFormat,
  bio: BioFormat.optional(),
  avatar: AvatarFormat.optional(),
});

export const EditSchema = z.object({
  wallet: WalletFormat,
  nickname: NicknameFormat.optional(),
  bio: BioFormat.optional(),
  avatar: AvatarFormat.optional(),
});
