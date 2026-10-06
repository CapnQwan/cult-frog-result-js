import { isError } from '../predicates/isError.js';
import { err } from '../wrappers/err.js';

import type { Err } from '../_types/err.js';

/**
 * Converts a thrown value into an {@link Err} with the code `'UNKNOWN'`.
 *
 * This is the default error conversion used by `tryCatch` and
 * `tryCatchAsync`. Because JavaScript allows any value to be thrown, the
 * conversion depends on what was thrown:
 *
 * - An `Error` keeps its `message` and, if it has one, its `stack`. This
 *   includes errors created in another realm, such as an iframe or a Node
 *   `vm` context, which fail an `instanceof Error` check.
 * - A string becomes the `message`.
 * - Any other value gets the message `'Non-Error value thrown'`.
 *
 * @example
 * ```ts
 * fromThrown(new Error('boom'));
 * // { success: false, code: 'UNKNOWN', message: 'boom', stack: 'Error: boom\n    at …' }
 *
 * fromThrown('boom');
 * // { success: false, code: 'UNKNOWN', message: 'boom' }
 *
 * fromThrown(42);
 * // { success: false, code: 'UNKNOWN', message: 'Non-Error value thrown' }
 * ```
 *
 * @param thrown - The value that was thrown or a promise was rejected with.
 * @returns An {@link Err} with the code `'UNKNOWN'` describing `thrown`.
 */
export function fromThrown(thrown: unknown): Err<'UNKNOWN'> {
  if (isError(thrown)) {
    if (thrown.stack === undefined) return err({ code: 'UNKNOWN', message: thrown.message });
    return err({ code: 'UNKNOWN', message: thrown.message, stack: thrown.stack });
  }
  const message = typeof thrown === 'string' ? thrown : 'Non-Error value thrown';
  return err({ code: 'UNKNOWN', message });
}
