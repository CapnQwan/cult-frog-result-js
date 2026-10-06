import { describe, expectTypeOf, it } from 'vitest';

import { err } from '../../wrappers/err.js';
import { tryCatchAsync } from '../tryCatchAsync.js';

import type { Result } from '../../_types/index.js';

describe('tryCatchAsync', () => {
  it('resolves to a Result with an UNKNOWN code by default', () => {
    expectTypeOf(tryCatchAsync(async () => 42)).toEqualTypeOf<Promise<Result<number, 'UNKNOWN'>>>();
  });

  it('uses the code returned by mapError', () => {
    const result = tryCatchAsync(
      async () => 42,
      () => err({ code: 'FETCH', message: '' })
    );

    expectTypeOf(result).toEqualTypeOf<Promise<Result<number, 'FETCH'>>>();
  });

  it('passes the rejection reason to mapError as unknown', () => {
    void tryCatchAsync(
      async () => 42,
      (thrown) => {
        expectTypeOf(thrown).toBeUnknown();
        return err({ code: 'FETCH', message: '' });
      }
    );
  });

  it('requires a function that returns a promise', () => {
    // @ts-expect-error fn must return a promise
    void tryCatchAsync(() => 42);
  });

  it('requires mapError to return an Err', () => {
    void tryCatchAsync(
      async () => 42,
      // @ts-expect-error mapError must return an Err
      () => 'FETCH'
    );
  });
});
