import type { Err } from '../_types/err.js';

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
export function err<const C extends string = string>(options: Omit<Err<C>, 'success'>): Err<C> {
  return { success: false, ...options };
}
