import { describe, expectTypeOf, it } from 'vitest';

import type { Err, Ok, Result } from '../index.js';

describe('Result', () => {
  it('is a union of Ok and Err', () => {
    expectTypeOf<Result<number, 'NOT_FOUND'>>().toEqualTypeOf<Ok<number> | Err<'NOT_FOUND'>>();
  });

  it('defaults the error code to string', () => {
    expectTypeOf<Result<number>>().toEqualTypeOf<Ok<number> | Err<string>>();
    expectTypeOf<Err>().toEqualTypeOf<Err<string>>();
  });

  it('only accepts string error codes', () => {
    // @ts-expect-error error codes must be strings
    expectTypeOf<Result<number, number>>();
    // @ts-expect-error error codes must be strings
    expectTypeOf<Err<number>>();
  });

  it('narrows on the success discriminant', () => {
    const result = {} as Result<number, 'NOT_FOUND'>;

    if (result.success) {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
      expectTypeOf(result.data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Err<'NOT_FOUND'>>();
      expectTypeOf(result.code).toEqualTypeOf<'NOT_FOUND'>();
      expectTypeOf(result.message).toEqualTypeOf<string>();
      expectTypeOf(result.stack).toEqualTypeOf<string | undefined>();
    }
  });

  it('narrows a union of codes', () => {
    const result = {} as Result<number, 'EMPTY' | 'NOT_A_NUMBER'>;

    if (!result.success && result.code === 'EMPTY') {
      expectTypeOf(result.code).toEqualTypeOf<'EMPTY'>();
    }
  });

  it('does not expose data or error fields before narrowing', () => {
    const result = {} as Result<number>;

    // @ts-expect-error `data` only exists on Ok
    result.data;
    // @ts-expect-error `code` only exists on Err
    result.code;
    // @ts-expect-error `message` only exists on Err
    result.message;
  });

  it('has readonly fields', () => {
    const success = {} as Ok<number>;
    const failure = {} as Err;

    // @ts-expect-error `success` is readonly
    success.success = true;
    // @ts-expect-error `data` is readonly
    success.data = 1;
    // @ts-expect-error `success` is readonly
    failure.success = false;
    // @ts-expect-error `code` is readonly
    failure.code = 'OTHER';
    // @ts-expect-error `message` is readonly
    failure.message = 'other';
    // @ts-expect-error `stack` is readonly
    failure.stack = 'other';
  });
});
