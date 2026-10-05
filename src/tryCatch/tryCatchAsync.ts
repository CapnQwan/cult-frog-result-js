import { fromThrown } from '../fromThrown.js';
import { ok } from '../wrappers/ok.js';

import type { Err } from '../_types/err.js';
import type { Result } from '../_types/result.js';

export function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, 'UNKNOWN'>>;
export function tryCatchAsync<T, C extends string>(
  fn: () => Promise<T>,
  mapError: (thrown: unknown) => Err<C>
): Promise<Result<T, C>>;
export async function tryCatchAsync<T, C extends string>(
  fn: () => Promise<T>,
  mapError = fromThrown as (thrown: unknown) => Err<C>
): Promise<Result<T, C>> {
  try {
    return ok(await fn());
  } catch (thrown) {
    return mapError(thrown);
  }
}
