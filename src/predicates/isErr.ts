import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

/**
 * Checks whether a {@link Result} is an {@link Err}, narrowing its type.
 *
 * Checking `!result.success` directly narrows the same way. This function is
 * most useful as a callback.
 *
 * @example
 * ```ts
 * const errors = results.filter(isErr).map((r) => r.error);
 * ```
 *
 * @param result - The result to check.
 * @returns `true` if `result` is an {@link Err}.
 */
export function isErr<T, C extends string>(result: Result<T, C>): result is Err<C> {
  return !result.success;
}
