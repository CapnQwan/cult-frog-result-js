import type { Ok } from '../_types/ok.js';
import type { Result } from '../_types/result.js';

/**
 * Checks whether a {@link Result} is an {@link Ok}, narrowing its type.
 *
 * Checking `result.success` directly narrows the same way. This function is
 * most useful as a callback.
 *
 * @example
 * ```ts
 * const values = results.filter(isOk).map((r) => r.data);
 * ```
 *
 * @param result - The result to check.
 * @returns `true` if `result` is an {@link Ok}.
 */
export function isOk<T, C extends string>(result: Result<T, C>): result is Ok<T> {
  return result.success;
}
