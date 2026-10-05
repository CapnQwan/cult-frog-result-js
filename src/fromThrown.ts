import { err } from './wrappers/err.js';

import type { Err } from './_types/err.js';

export function fromThrown(thrown: unknown): Err<'UNKNOWN'> {
  if (thrown instanceof Error) {
    if (thrown.stack === undefined) return err({ code: 'UNKNOWN', message: thrown.message });
    return err({ code: 'UNKNOWN', message: thrown.message, stack: thrown.stack });
  }
  const message = typeof thrown === 'string' ? thrown : 'Non-Error value thrown';
  return err({ code: 'UNKNOWN', message });
}
