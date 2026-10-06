import type { Ok } from '../_types/ok.js';
import type { Result } from '../_types/result.js';

/**
 * Checks whether a {@link Result} succeeded, narrowing it to an {@link Ok}.
 *
 * This is equivalent to checking `result.success`, and narrows the type in
 * the same way. It is most useful as a callback, for example to keep only the
 * successful results in an array.
 *
 * @example
 * ```ts
 * const results: Result<number, 'NOT_AN_INTEGER'>[] = inputs.map(parseInteger);
 *
 * const values = results.filter(isOk).map((result) => result.data); // number[]
 * ```
 *
 * @typeParam T - The type of the value produced on success.
 * @typeParam C - The error codes the result can fail with.
 * @param result - The result to check.
 * @returns `true` if `result` is an {@link Ok}, otherwise `false`.
 */
export function isOk<T, C extends string>(result: Result<T, C>): result is Ok<T> {
  return result.success;
}
