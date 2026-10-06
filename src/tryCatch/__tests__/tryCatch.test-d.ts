import { describe, expectTypeOf, it } from 'vitest';

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
