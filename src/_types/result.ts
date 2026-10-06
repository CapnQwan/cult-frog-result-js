import type { Err } from './err.js';
import type { Ok } from './ok.js';

/**
 * The outcome of an operation that can fail: either an {@link Ok} holding the
 * value it produced, or an {@link Err} describing why it failed.
 *
 * Returning a `Result` instead of throwing makes failure part of a function's
 * signature, so callers must handle it before they can use the value. The
 * `success` field is the discriminant: checking it narrows the result to one
 * variant, and narrowing further on `code` lets each kind of failure be
 * handled separately.
 *
 * @example
 * ```ts
 * function parsePort(input: string): Result<number, 'NOT_AN_INTEGER' | 'OUT_OF_RANGE'> {
 *   const port = Number(input);
 *   if (!Number.isInteger(port)) {
 *     return err({ code: 'NOT_AN_INTEGER', message: `"${input}" is not an integer` });
 *   }
 *   if (port < 0 || port > 65535) {
 *     return err({ code: 'OUT_OF_RANGE', message: `${port} is not between 0 and 65535` });
 *   }
 *   return ok(port);
 * }
 *
 * const result = parsePort('8080');
 *
 * if (result.success) {
 *   result.data; // number
 * } else {
 *   result.code; // 'NOT_AN_INTEGER' | 'OUT_OF_RANGE'
 * }
 * ```
 *
 * @typeParam T - The type of the value produced on success.
 * @typeParam C - The error codes the operation can fail with. Defaults to
 * `string`.
 */
export type Result<T, C extends string = string> = Ok<T> | Err<C>;
