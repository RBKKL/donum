import type { SetRequired, Simplify } from "type-fest";

export type * from "type-fest";

/** Remove "undefined" from all properties of a type */
export type RemoveUndefined<T> = Simplify<Required<T>>;

/** Remove "| undefined" and "| null" from all properties of a type */
export type RemoveUndefinedOrNull<T> = Simplify<{
  [K in keyof T]-?: NonNullable<T[K]>;
}>;

/** make all properties of a type optional except for the ones specified */
export type PartialExcept<T, K extends keyof T> = SetRequired<Partial<T>, K>;
