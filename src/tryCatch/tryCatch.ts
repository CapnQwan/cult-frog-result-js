import { fromThrown } from '../fromThrown.js';
import { ok } from '../wrappers/ok.js';

import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

export function tryCatch<T>(fn: () => T): Result<T, 'UNKNOWN'>;
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
