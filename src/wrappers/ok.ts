import type { Ok } from '../_types/ok.js';

/**
 * Creates a successful `Result` with no value.
 *
 * Use this for operations that can fail but produce nothing on success, such
 * as writes and deletes.
 *
 * @example
 * ```ts
 * function deleteUser(id: number): Result<undefined, 'NOT_FOUND'> {
 *   if (!users.delete(id)) {
 *     return err({ code: 'NOT_FOUND', message: `User ${id} does not exist` });
 *   }
 *   return ok();
 * }
 * ```
 *
 * @returns An {@link Ok} whose `data` is `undefined`.
 */
export function ok(): Ok<undefined>;
/**
 * Wraps a value in a successful `Result`.
 *
 * The value is stored as is, without copying, and any value is treated as a
 * success, including `undefined`, `null`, `false`, `0` and `''`.
 *
 * @example
 * ```ts
 * const result = ok(42); // Ok<number>
 *
 * result.success; // true
 * result.data; // 42
 * ```
 *
 * @typeParam T - The type of the value.
 * @param data - The value produced by the operation.
 * @returns An {@link Ok} holding `data`.
 */
export function ok<T>(data: T): Ok<T>;
export function ok<T>(data?: T): Ok<T | undefined> {
  return { success: true, data };
}
