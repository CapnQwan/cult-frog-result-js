import type { Err } from './_types/err.js';

export function fromThrown(thrown: unknown): Err<'UNKNOWN'> {
  if (thrown instanceof Error) {
    if (thrown.stack === undefined)
      return { success: false, code: 'UNKNOWN', message: thrown.message };
    return { success: false, code: 'UNKNOWN', message: thrown.message, stack: thrown.stack };
  }
  return {
    success: false,
    code: 'UNKNOWN',
    message: typeof thrown === 'string' ? thrown : 'Non-Error value thrown',
  };
}
