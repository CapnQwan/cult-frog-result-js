import { describe, expectTypeOf, it } from 'vitest';

import type { Err, Ok, Result } from '../index.js';

describe('package entry point', () => {
  it('exports the public types', () => {
    expectTypeOf<Result<number, 'NOT_FOUND'>>().toEqualTypeOf<Ok<number> | Err<'NOT_FOUND'>>();
  });
});
