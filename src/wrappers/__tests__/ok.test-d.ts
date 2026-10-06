import { describe, expectTypeOf, it } from 'vitest';

import { ok } from '../ok.js';

import type { Ok, Result } from '../../_types/index.js';

describe('ok', () => {
  it('infers the value type', () => {
    expectTypeOf(ok(42)).toEqualTypeOf<Ok<number>>();
    expectTypeOf(ok('hi')).toEqualTypeOf<Ok<string>>();
    expectTypeOf(ok({ id: 1 })).toEqualTypeOf<Ok<{ id: number }>>();
  });

  it('returns Ok<undefined> when called without a value', () => {
    expectTypeOf(ok()).toEqualTypeOf<Ok<undefined>>();
  });

  it('is assignable to a Result with any error code', () => {
    expectTypeOf(ok(42)).toExtend<Result<number>>();
    expectTypeOf(ok(42)).toExtend<Result<number, 'NOT_FOUND'>>();
  });

  it('is not assignable to a Result with a different value type', () => {
    expectTypeOf(ok('hi')).not.toExtend<Result<number>>();
  });
});
