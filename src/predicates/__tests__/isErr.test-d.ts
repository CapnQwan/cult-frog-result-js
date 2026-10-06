import { describe, expectTypeOf, it } from 'vitest';

import { isErr } from '../isErr.js';

import type { Err, Ok, Result } from '../../_types/index.js';

describe('isErr', () => {
  it('narrows to Err, and to Ok otherwise', () => {
    const result = {} as Result<number, 'NOT_FOUND'>;

    if (isErr(result)) {
      expectTypeOf(result).toEqualTypeOf<Err<'NOT_FOUND'>>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
    }
  });

  it('narrows the element type when used with filter', () => {
    const results = [] as Result<number, 'NOT_FOUND'>[];

    expectTypeOf(results.filter(isErr)).toEqualTypeOf<Err<'NOT_FOUND'>[]>();
  });
});
