import { fromThrown } from '../transforms/fromThrown.js';
import { ok } from '../wrappers/ok.js';

import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

/**
 * Calls an asynchronous function that may reject and captures the outcome as
 * a {@link Result}.
 *
 * If the promise returned by `fn` resolves, its value is wrapped in an `Ok`.
 * If it rejects, or `fn` throws before returning a promise, the error is
 * converted to an {@link Err} with the code `'UNKNOWN'`:
 *
 * - An `Error` keeps its `message` and, if it has one, its `stack`.
 * - A string becomes the `message`.
 * - Any other value gets the message `'Non-Error value thrown'`.
 *
 * The returned promise always resolves and never rejects. To give failures
 * meaningful codes, pass a `mapError` function.
 *
 * @example
 * ```ts
 * const result = await tryCatchAsync(() => fetch(url));
 * // Result<Response, 'UNKNOWN'>
 *
 * if (!result.success) {
 *   console.error(result.message);
 * }
 * ```
 *
 * @typeParam T - The type the promise returned by `fn` resolves to.
 * @param fn - The function to call. It is called once, immediately.
 * @returns A promise that resolves to an `Ok` holding the resolved value, or
 * to an {@link Err} with the code `'UNKNOWN'` if `fn` rejects or throws.
 */
export function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, 'UNKNOWN'>>;
/**
 * Calls an asynchronous function that may reject and captures the outcome as
 * a {@link Result}, using `mapError` to convert the rejection into an
 * {@link Err}.
 *
 * If the promise returned by `fn` resolves, its value is wrapped in an `Ok`.
 * If it rejects, or `fn` throws before returning a promise, `mapError` is
 * called with the error and its return value is used as the result. `mapError`
 * is not called when the promise resolves.
 *
 * The returned promise always resolves and never rejects, unless `mapError`
 * itself throws.
 *
 * @example
 * ```ts
 * const result = await tryCatchAsync(
 *   () => fetch(url),
 *   (thrown) =>
 *     err({
 *       code: 'NETWORK_ERROR',
 *       message: thrown instanceof Error ? thrown.message : `Could not reach ${url}`,
 *     })
 * );
 * // Result<Response, 'NETWORK_ERROR'>
 * ```
 *
 * @typeParam T - The type the promise returned by `fn` resolves to.
 * @typeParam C - The error codes `mapError` can return.
 * @param fn - The function to call. It is called once, immediately.
 * @param mapError - Converts the rejection reason, or the value thrown by
 * `fn`, into an {@link Err}. The value is typed as `unknown`, because
 * JavaScript allows any value to be thrown.
 * @returns A promise that resolves to an `Ok` holding the resolved value, or
 * to the {@link Err} returned by `mapError` if `fn` rejects or throws.
 */
export function tryCatchAsync<T, C extends string>(
  fn: () => Promise<T>,
  mapError: (thrown: unknown) => Err<C>
): Promise<Result<T, C>>;
export async function tryCatchAsync<T>(
  fn: () => Promise<T>,
  mapError: (thrown: unknown) => Err = fromThrown
): Promise<Result<T, string>> {
  try {
    return ok(await fn());
  } catch (thrown) {
    return mapError(thrown);
  }
}
