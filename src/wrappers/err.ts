import type { Err } from '../_types/err.js';

/**
 * Creates a failed `Result` from an error code and message.
 *
 * The code is inferred as a string literal, so `as const` is not needed for
 * the result to carry its exact code. To return one of several codes from a
 * function, annotate the function's return type, or pass the codes explicitly
 * as a type argument.
 *
 * The returned object is a new, plain object. `stack` is only included when
 * it is provided.
 *
 * @example
 * ```ts
 * const result = err({ code: 'NOT_FOUND', message: 'User 42 does not exist' });
 * // Err<'NOT_FOUND'>
 *
 * function findUser(id: number): Result<User, 'NOT_FOUND' | 'FORBIDDEN'> {
 *   const user = users.get(id);
 *   if (!user) return err({ code: 'NOT_FOUND', message: `User ${id} does not exist` });
 *   if (!user.visible) return err({ code: 'FORBIDDEN', message: `User ${id} is private` });
 *   return ok(user);
 * }
 * ```
 *
 * @typeParam C - The error code. Inferred from `options.code`.
 * @param options - The details of the failure.
 * @param options.code - A stable, machine-readable code identifying the kind
 * of failure.
 * @param options.message - A human-readable description of the failure.
 * @param options.stack - The stack trace of the error that caused the
 * failure, if one is available.
 * @returns An {@link Err} with the given code, message and stack.
 */
export function err<const C extends string = string>(options: Omit<Err<C>, 'success'>): Err<C> {
  return { success: false, ...options };
}
