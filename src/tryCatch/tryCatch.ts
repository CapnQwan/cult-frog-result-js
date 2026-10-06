import { fromThrown } from '../transforms/fromThrown.js';
import { ok } from '../wrappers/ok.js';

import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

/**
 * Calls a function that may throw and captures the outcome as a
 * {@link Result}.
 *
 * If `fn` returns, its return value is wrapped in an `Ok`. If it throws, the
 * thrown value is converted to an {@link Err} with the code `'UNKNOWN'`:
 *
 * - An `Error` keeps its `message` and, if it has one, its `stack`.
 * - A thrown string becomes the `message`.
 * - Any other value gets the message `'Non-Error value thrown'`.
 *
 * Use this at the boundary with code that throws, such as `JSON.parse` or
 * third-party libraries. To give failures meaningful codes, pass a `mapError`
 * function.
 *
 * `tryCatch` does not wait for promises. If `fn` returns a promise, the
 * promise itself is wrapped in an `Ok` and any rejection is not caught. Use
 * `tryCatchAsync` for asynchronous functions.
 *
 * @example
 * ```ts
 * const result = tryCatch(() => JSON.parse(input));
 * // Result<any, 'UNKNOWN'>
 *
 * if (!result.success) {
 *   console.error(result.message);
 * }
 * ```
 *
 * @typeParam T - The return type of `fn`.
 * @param fn - The function to call. It is called once, immediately.
 * @returns An `Ok` holding the return value of `fn`, or an {@link Err} with
 * the code `'UNKNOWN'` if it throws.
 */
export function tryCatch<T>(fn: () => T): Result<T, 'UNKNOWN'>;
/**
 * Calls a function that may throw and captures the outcome as a
 * {@link Result}, using `mapError` to convert anything thrown into an
 * {@link Err}.
 *
 * If `fn` returns, its return value is wrapped in an `Ok`. If it throws,
 * `mapError` is called with the thrown value and its return value is used as
 * the result. `mapError` is not called when `fn` returns. If `mapError`
 * itself throws, that error is not caught and is thrown to the caller.
 *
 * `tryCatch` does not wait for promises. If `fn` returns a promise, the
 * promise itself is wrapped in an `Ok` and any rejection is not caught. Use
 * `tryCatchAsync` for asynchronous functions.
 *
 * @example
 * ```ts
 * const result = tryCatch(
 *   () => JSON.parse(input) as Config,
 *   (thrown) =>
 *     err({
 *       code: 'INVALID_CONFIG',
 *       message: thrown instanceof Error ? thrown.message : 'Config is not valid JSON',
 *     })
 * );
 * // Result<Config, 'INVALID_CONFIG'>
 * ```
 *
 * @typeParam T - The return type of `fn`.
 * @typeParam C - The error codes `mapError` can return.
 * @param fn - The function to call. It is called once, immediately.
 * @param mapError - Converts the value thrown by `fn` into an {@link Err}.
 * The thrown value is typed as `unknown`, because JavaScript allows any value
 * to be thrown.
 * @returns An `Ok` holding the return value of `fn`, or the {@link Err}
 * returned by `mapError` if `fn` throws.
 */
export function tryCatch<T, C extends string>(
  fn: () => T,
  mapError: (thrown: unknown) => Err<C>
): Result<T, C>;
export function tryCatch<T>(
  fn: () => T,
  mapError: (thrown: unknown) => Err = fromThrown
): Result<T, string> {
  try {
    return ok(fn());
  } catch (thrown) {
    return mapError(thrown);
  }
}
