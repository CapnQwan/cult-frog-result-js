import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

/**
 * Checks whether a {@link Result} failed, narrowing it to an {@link Err}.
 *
 * This is equivalent to checking `!result.success`, and narrows the type in
 * the same way. It is most useful as a callback, for example to collect the
 * failures from an array of results.
 *
 * @example
 * ```ts
 * const results: Result<number, 'NOT_AN_INTEGER'>[] = inputs.map(parseInteger);
 *
 * const messages = results.filter(isErr).map((result) => result.message); // string[]
 * ```
 *
 * @typeParam T - The type of the value produced on success.
 * @typeParam C - The error codes the result can fail with.
 * @param result - The result to check.
 * @returns `true` if `result` is an {@link Err}, otherwise `false`.
 */
export function isErr<T, C extends string>(result: Result<T, C>): result is Err<C> {
  return !result.success;
}
