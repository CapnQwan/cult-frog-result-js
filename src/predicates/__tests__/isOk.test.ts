import { describe, expect, it } from 'vitest';

import { err } from '../../wrappers/err.js';
import { ok } from '../../wrappers/ok.js';
import { isOk } from '../isOk.js';

import type { Result } from '../../_types/result.js';

describe('isOk', () => {
  it('returns true for an Ok', () => {
    expect(isOk(ok(42))).toBe(true);
  });

  it('returns false for an Err', () => {
    expect(isOk(err({ code: 'BOOM', message: 'boom' }))).toBe(false);
  });

  it('checks the discriminant, not the value', () => {
    expect(isOk(ok(false))).toBe(true);
    expect(isOk(ok(undefined))).toBe(true);
    expect(isOk(ok())).toBe(true);
  });

  it('keeps only the successes when used as a filter callback', () => {
    const results: Result<number>[] = [ok(1), err({ code: 'BOOM', message: 'boom' }), ok(2)];

    expect(results.filter(isOk).map((r) => r.data)).toStrictEqual([1, 2]);
  });
});
