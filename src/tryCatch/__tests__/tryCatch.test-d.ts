import { describe, expectTypeOf, it } from 'vitest';

import { fromThrown } from '../../transforms/fromThrown.js';
import { err } from '../../wrappers/err.js';
import { tryCatch } from '../tryCatch.js';

import type { Result } from '../../_types/index.js';

describe('tryCatch', () => {
  it('returns a Result with an UNKNOWN code by default', () => {
    expectTypeOf(tryCatch(() => 42)).toEqualTypeOf<Result<number, 'UNKNOWN'>>();
    expectTypeOf(tryCatch(() => {})).toEqualTypeOf<Result<void, 'UNKNOWN'>>();
  });

  it('uses the code returned by mapError', () => {
    const result = tryCatch(
      () => 42,
      () => err({ code: 'PARSE', message: '' })
    );

    expectTypeOf(result).toEqualTypeOf<Result<number, 'PARSE'>>();
  });

  it('combines the codes when mapError falls back to fromThrown', () => {
    const result = tryCatch(
      () => 42,
      (thrown) =>
        thrown instanceof SyntaxError
          ? err({ code: 'INVALID_JSON', message: thrown.message })
          : fromThrown(thrown)
    );

    expectTypeOf(result).toEqualTypeOf<Result<number, 'INVALID_JSON' | 'UNKNOWN'>>();
  });

  it('passes the thrown value to mapError as unknown', () => {
    tryCatch(
      () => 42,
      (thrown) => {
        expectTypeOf(thrown).toBeUnknown();
        return err({ code: 'PARSE', message: '' });
      }
    );
  });

  it('requires mapError to return an Err', () => {
    tryCatch(
      () => 42,
      // @ts-expect-error mapError must return an Err
      () => 'PARSE'
    );
  });
});
