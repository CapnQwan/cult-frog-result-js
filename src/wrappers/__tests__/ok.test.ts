import { describe, expect, it } from 'vitest';

import { ok } from '../ok.js';

describe('ok', () => {
  it('wraps a value in a successful result', () => {
    expect(ok(42)).toStrictEqual({ success: true, data: 42 });
  });

  it('wraps undefined when called without a value', () => {
    expect(ok()).toStrictEqual({ success: true, data: undefined });
  });

  it('keeps the same reference for object values', () => {
    const value = { id: 1 };

    expect(ok(value).data).toBe(value);
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['false', false],
    ['zero', 0],
    ['an empty string', ''],
  ])('treats %s as a successful value', (_, value) => {
    expect(ok(value)).toStrictEqual({ success: true, data: value });
  });

  it('returns a plain object that survives a JSON round trip', () => {
    const success = ok({ id: 1 });

    expect(JSON.parse(JSON.stringify(success))).toStrictEqual(success);
  });
});
