import { describe, expectTypeOf, it } from 'vitest';

import { fromThrown } from '../fromThrown.js';

import type { Err, Result } from '../_types/index.js';

describe('fromThrown', () => {
  it('accepts any thrown value and returns an UNKNOWN Err', () => {
    expectTypeOf(fromThrown).parameter(0).toBeUnknown();
    expectTypeOf(fromThrown).returns.toEqualTypeOf<Err<'UNKNOWN'>>();
  });

  it('can be returned as a Result with an UNKNOWN code', () => {
    expectTypeOf(fromThrown(null)).toExtend<Result<number, 'UNKNOWN'>>();
  });
});
