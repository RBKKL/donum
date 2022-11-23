import { format } from "date-fns";
import { BigNumber, BigNumberish } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from "./constants";

// TODO: check for optimal
export const isNumber = (value: string): boolean =>
  !!value.match(/^\d+\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};

export const formatTimestamp = (timestamp: BigNumber): string => {
  return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm");
};

export const formatAddress = (address?: string): string => {
  if (!address) {
    return "";
  }

  const leadingChars = 6; // 0x + 4 chars
  const trailingChars = 4;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars
      )}`;
};

export const formatTokenAmount = (
  amount: BigNumberish,
  units: string | BigNumberish = "ether", // ethers units or token decimals
  decimals = 5 // number of decimals to show after the comma
): string => {
  const formattedAmount = formatUnits(amount, units);
  const [integer, decimal] = formattedAmount.split(".");
  const formattedDecimal = (decimal || "0").slice(0, decimals);
  return `${integer}.${formattedDecimal}`;
};

export const isCorrectNickname = (nickname: string) => {
  return (
    nickname.length >= NICKNAME_MIN_LENGTH &&
    nickname.length <= NICKNAME_MAX_LENGTH &&
    nickname.match(/^(\w)*$/)
  );
};
