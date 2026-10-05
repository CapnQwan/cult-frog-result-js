import type { Err } from './_types/err.js';
import type { Ok } from './_types/ok.js';

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

/**
 * Wraps an error in a failed `Result`.
 *
 * The error can be any type, such as an `Error`, a string or a custom error
 * object.
 *
 * @example
 * ```ts
 * const result = err(new Error('Not found')); // Err<Error>
 * const coded = err({ code: 'NOT_FOUND' as const }); // Err<{ code: 'NOT_FOUND' }>
 * ```
 *
 * @typeParam E - The type of the error value. Defaults to `Error`.
 * @param error - The error to wrap.
 * @returns An {@link Err} holding `error`.
 */
export function err<C extends string = string>(options: Omit<Err<C>, 'success'>): Err<C> {
  return { success: false, ...options };
}
