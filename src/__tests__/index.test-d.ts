import { describe, expectTypeOf, it } from 'vitest';

import { Result, tryCatchAsync } from '../index.js';

import type { Err, Ok } from '../index.js';

describe('package entry point', () => {
  it('exports the public types', () => {
    expectTypeOf<Result<number, 'NOT_FOUND'>>().toEqualTypeOf<Ok<number> | Err<'NOT_FOUND'>>();
  });

  it('lets one Result import serve as both the type and the namespace', () => {
    function findUser(): Result<number, 'NOT_FOUND'> {
      return Result.ok(1);
    }

    expectTypeOf(findUser()).toEqualTypeOf<Ok<number> | Err<'NOT_FOUND'>>();
  });

  it('keeps overloads on the Result namespace', () => {
    expectTypeOf(Result.tryCatchAsync).toEqualTypeOf(tryCatchAsync);
    expectTypeOf(Result.ok()).toEqualTypeOf<Ok<undefined>>();
    expectTypeOf(Result.ok(1)).toEqualTypeOf<Ok<number>>();
  });
});
