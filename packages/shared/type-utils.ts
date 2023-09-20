import type { SetRequired, Simplify } from "type-fest";
export type * from "type-fest";

export type RemoveUndefined<T> = Simplify<Required<T>>;

// type to remove "| undefined" and "| null" from all properties of a type
export type RemoveUndefinedOrNull<T> = Simplify<{
  [K in keyof T]-?: NonNullable<T[K]>;
}>;

// type to make all properties of a type optional except for the ones specified
export type PartialExcept<T, K extends keyof T> = SetRequired<Partial<T>, K>;
