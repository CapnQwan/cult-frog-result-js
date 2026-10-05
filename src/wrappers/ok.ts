import type { Ok } from '../_types/ok.js';

export function ok(): Ok<undefined>;
export function ok<T>(data: T): Ok<T>;

/**
 * Wraps a value in a successful `Result`.
 *
 * @example
 * ```ts
 * const result = ok(42); // Ok<number>
 * ```
 *
 * @typeParam T - The type of the success value.
 * @param data - The value to wrap.
 * @returns An {@link Ok} holding `data`.
 */
export function ok<T>(data?: T): Ok<T | undefined> {
  return { success: true, data };
}
