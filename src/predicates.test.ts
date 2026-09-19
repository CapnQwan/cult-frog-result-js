import { describe, expect, it } from 'vitest';

import { isErr, isOk } from './predicates.js';
import { err, ok } from './wrappers.js';

import type { Result } from './_types/result.js';

describe('isOk', () => {
  it('returns true for an Ok', () => {
    expect(isOk(ok(42))).toBe(true);
  });

  it('returns false for an Err', () => {
    expect(isOk(err(new Error('boom')))).toBe(false);
  });

  it('checks the discriminant, not the value', () => {
    expect(isOk(ok(false))).toBe(true);
    expect(isOk(ok(undefined))).toBe(true);
  });
});

describe('isErr', () => {
  it('returns true for an Err', () => {
    expect(isErr(err(new Error('boom')))).toBe(true);
  });

  it('returns false for an Ok', () => {
    expect(isErr(ok(42))).toBe(false);
  });

  it('checks the discriminant, not the error', () => {
    expect(isErr(err(undefined))).toBe(true);
    expect(isErr(err(''))).toBe(true);
  });
});

describe('as filter callbacks', () => {
  const failure = new Error('boom');
  const results: Result<number>[] = [ok(1), err(failure), ok(2)];

  it('isOk keeps only the successes', () => {
    expect(results.filter(isOk).map((r) => r.data)).toStrictEqual([1, 2]);
  });

  it('isErr keeps only the failures', () => {
    expect(results.filter(isErr).map((r) => r.error)).toStrictEqual([failure]);
  });
});
