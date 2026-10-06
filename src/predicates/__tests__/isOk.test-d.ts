import { describe, expectTypeOf, it } from 'vitest';

import { isOk } from '../isOk.js';

import type { Err, Ok, Result } from '../../_types/index.js';

describe('isOk', () => {
  it('narrows to Ok, and to Err otherwise', () => {
    const result = {} as Result<number, 'NOT_FOUND'>;

    if (isOk(result)) {
      expectTypeOf(result).toEqualTypeOf<Ok<number>>();
    } else {
      expectTypeOf(result).toEqualTypeOf<Err<'NOT_FOUND'>>();
    }
  });

  it('narrows the element type when used with filter', () => {
    const results = [] as Result<number, 'NOT_FOUND'>[];

    expectTypeOf(results.filter(isOk)).toEqualTypeOf<Ok<number>[]>();
  });
});
