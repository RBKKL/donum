import { z } from "zod";
import { BIO_MAX_LENGTH, NICKNAME_MAX_LENGTH } from "@lib/constants";
import { ethers } from "ethers";

export const NicknameSchema = z.string().max(NICKNAME_MAX_LENGTH);
export const WalletSchema = z.string().refine((val) => ethers.utils.isAddress(val), {
  message: "String must be in wallet format"
});
export const BioSchema = z.string().max(BIO_MAX_LENGTH);
export const AvatarSchema = z.string().startsWith("data:image/");

export const AddSchema = z.object({
  wallet: WalletSchema,
  nickname: NicknameSchema,
  bio: BioSchema.optional(),
  avatar: AvatarSchema.optional()})

export const EditSchema = z.object({
  wallet: WalletSchema,
  nickname: NicknameSchema.optional(),
  bio: BioSchema.optional(),
  avatar: AvatarSchema.optional(),
})