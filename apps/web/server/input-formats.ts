import { z } from "zod";
import {
  DESCRIPTION_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
} from "@donum/shared/constants";
import { isCorrectNickname, isEthAddress } from "@donum/shared/helpers";

export const NicknameFormat = z
  .string()
  .refine((val) => val === "" || isCorrectNickname(val), {
    message: "Invalid nickname format",
  });

export const AddressFormat = z.string().refine((val) => isEthAddress(val), {
  message: "String must be in wallet format",
});

export const DescriptionFormat = z.string().max(DESCRIPTION_MAX_LENGTH);

export const MessageFormat = z.string().max(MESSAGE_MAX_LENGTH);

export const NotificationDurationFormat = z.number().int();
export const AvatarUrlFormat = z.string().url();
export const SoundUrlFormat = z.string().url();
export const AmountFormat = z.bigint().gte(0n);
