import { z } from "zod";
import { DESCRIPTION_MAX_LENGTH, NICKNAME_MAX_LENGTH } from "shared/constants";
import { ethers } from "ethers";

export const NicknameFormat = z.string().max(NICKNAME_MAX_LENGTH);
export const AddressFormat = z
  .string()
  .refine((val) => ethers.utils.isAddress(val), {
    message: "String must be in wallet format",
  });
export const DescriptionFormat = z.string().max(DESCRIPTION_MAX_LENGTH);
export const AvatarFormat = z.string().startsWith("data:image/");

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
});
