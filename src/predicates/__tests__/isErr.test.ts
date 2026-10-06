import { describe, expect, it } from 'vitest';

import { err } from '../../wrappers/err.js';
import { ok } from '../../wrappers/ok.js';
import { isErr } from '../isErr.js';

import type { Result } from '../../_types/result.js';

describe('isErr', () => {
  it('returns true for an Err', () => {
    expect(isErr(err({ code: 'BOOM', message: 'boom' }))).toBe(true);
  });

  it('returns false for an Ok', () => {
    expect(isErr(ok(42))).toBe(false);
  });

  it('checks the discriminant, not the code or message', () => {
    expect(isErr(err({ code: '', message: '' }))).toBe(true);
  });

  it('keeps only the failures when used as a filter callback', () => {
    const failure = err({ code: 'BOOM', message: 'boom' });
    const results: Result<number>[] = [ok(1), failure, ok(2)];

    expect(results.filter(isErr)).toStrictEqual([failure]);
  });
});
