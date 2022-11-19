import { format } from "date-fns";
// TODO: check for optimal
export const isNumber = (value) => !!value.match(/^\d+\.?\d*$/);
export const reverseArray = (arr) => {
    if (!arr) {
        return [];
    }
    return [...arr].reverse();
};
export const formatTimestamp = (timestamp) => {
    return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm");
};
export const formatAddress = (address) => {
    if (!address) {
        return "";
    }
    const leadingChars = 4;
    const trailingChars = 4;
    return address.length < leadingChars + trailingChars
        ? address
        : `${address.substring(0, leadingChars)}\u2026${address.substring(address.length - trailingChars)}`;
};
export const formatBalance = (formattedBalance) => formattedBalance.substring(0, 7);
