import type { Err } from './_types/err.js';
import type { Ok } from './_types/ok.js';
import type { Result } from './_types/result.js';

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
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.success;
}

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
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.success;
}
