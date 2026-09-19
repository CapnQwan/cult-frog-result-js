import type { Err } from './err.js';
import type { Ok } from './ok.js';

/**
 * The outcome of an operation that can fail: either an {@link Ok} holding a
 * value or an {@link Err} holding an error.
 *
 * The `success` field is the discriminant, so checking it narrows the type:
 *
 * @example
 * ```ts
 * function parsePort(input: string): Result<number> {
 *   const port = Number(input);
 *   if (!Number.isInteger(port)) return err(new Error(`Invalid port: ${input}`));
 *   return ok(port);
 * }
 *
 * const result = parsePort('8080');
 * if (result.success) {
 *   result.data; // number
 * } else {
 *   result.error; // Error
 * }
 * ```
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error value. Defaults to `Error`.
 */
export type Result<T, E = Error> = Ok<T> | Err<E>;
