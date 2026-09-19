import { describe, expectTypeOf, it } from 'vitest';

import { isErr, isOk } from './predicates.js';
import { err, ok } from './wrappers.js';

import type { Err, Ok, Result } from './_types/index.js';

describe('Result', () => {
  it('is a union of Ok and Err', () => {
    expectTypeOf<Result<number, string>>().toEqualTypeOf<Ok<number> | Err<string>>();
  });

  it('defaults the error type to Error', () => {
    expectTypeOf<Result<number>>().toEqualTypeOf<Ok<number> | Err<Error>>();
    expectTypeOf<Err>().toEqualTypeOf<Err<Error>>();
  });

  it('narrows on the success discriminant', () => {
    const result = {} as Result<number, string>;

    if (result.success) {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
      expectTypeOf(result.data).toEqualTypeOf<number>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Err<string>>();
      expectTypeOf(result.error).toEqualTypeOf<string>();
    }
  });

  it('does not expose data or error before narrowing', () => {
    const result = {} as Result<number>;

    // @ts-expect-error `data` only exists on Ok
    result.data;
    // @ts-expect-error `error` only exists on Err
    result.error;
  });

  it('has readonly fields', () => {
    const success = {} as Ok<number>;
    const failure = {} as Err;

    // @ts-expect-error `success` is readonly
    success.success = true;
    // @ts-expect-error `data` is readonly
    success.data = 1;
    // @ts-expect-error `error` is readonly
    failure.error = new Error();
  });
});

describe('ok', () => {
  it('infers the value type', () => {
    expectTypeOf(ok(42)).toEqualTypeOf<Ok<number>>();
    expectTypeOf(ok('hi')).toEqualTypeOf<Ok<string>>();
    expectTypeOf(ok({ id: 1 })).toEqualTypeOf<Ok<{ id: number }>>();
  });

  it('is assignable to a Result with any error type', () => {
    expectTypeOf(ok(42)).toExtend<Result<number>>();
    expectTypeOf(ok(42)).toExtend<Result<number, string>>();
  });

  it('is not assignable to a Result with a different value type', () => {
    expectTypeOf(ok('hi')).not.toExtend<Result<number>>();
  });
});

describe('err', () => {
  it('infers the error type', () => {
    expectTypeOf(err(new Error())).toEqualTypeOf<Err<Error>>();
    expectTypeOf(err(new TypeError())).toEqualTypeOf<Err<TypeError>>();
    expectTypeOf(err('not found')).toEqualTypeOf<Err<string>>();
    expectTypeOf(err({ code: 'NOT_FOUND' as const })).toEqualTypeOf<Err<{ code: 'NOT_FOUND' }>>();
  });

  it('is assignable to a Result with the default error type', () => {
    expectTypeOf(err(new Error())).toExtend<Result<number>>();
  });

  it('is not assignable to a Result with a different error type', () => {
    expectTypeOf(err(new Error())).not.toExtend<Result<number, string>>();
    expectTypeOf(err('not found')).not.toExtend<Result<number>>();
  });

  it('can return a Result with a default error from an annotated function', () => {
    function parse(input: string): Result<number> {
      if (input === '') return err(new Error('empty'));
      return ok(Number(input));
    }

    expectTypeOf(parse).returns.toEqualTypeOf<Result<number>>();
  });
});

describe('isOk', () => {
  it('narrows to Ok, and to Err otherwise', () => {
    const result = {} as Result<number, string>;

    if (isOk(result)) {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Err<string>>();
    }
  });

  it('narrows the element type when used with filter', () => {
    const results = [] as Result<number, string>[];

    expectTypeOf(results.filter(isOk)).toEqualTypeOf<Ok<number>[]>();
  });
});

describe('isErr', () => {
  it('narrows to Err, and to Ok otherwise', () => {
    const result = {} as Result<number, string>;

    if (isErr(result)) {
      expectTypeOf(result).toEqualTypeOf<Err<string>>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
    }
  });

  it('narrows the element type when used with filter', () => {
    const results = [] as Result<number, string>[];

    expectTypeOf(results.filter(isErr)).toEqualTypeOf<Err<string>[]>();
  });
});
