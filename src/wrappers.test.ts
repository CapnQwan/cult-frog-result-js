import { describe, expect, it } from 'vitest';

import { err, ok } from './wrappers.js';

describe('ok', () => {
  it('wraps a value in a successful result', () => {
    expect(ok(42)).toStrictEqual({ success: true, data: 42 });
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
});

describe('err', () => {
  it('wraps an error in a failed result', () => {
    const error = new Error('boom');

    expect(err(error)).toStrictEqual({ success: false, error });
  });

  it('keeps the same Error instance', () => {
    const error = new TypeError('boom');
    const result = err(error);

    expect(result.error).toBe(error);
    expect(result.error).toBeInstanceOf(TypeError);
  });

  it.each([
    ['a string', 'not found'],
    ['an object', { code: 'NOT_FOUND' }],
    ['undefined', undefined],
  ])('accepts %s as the error', (_, error) => {
    expect(err(error)).toStrictEqual({ success: false, error });
  });
});

describe('results', () => {
  it('are plain objects that survive a JSON round trip', () => {
    const success = ok({ id: 1 });
    const failure = err({ code: 'NOT_FOUND' });

    expect(JSON.parse(JSON.stringify(success))).toStrictEqual(success);
    expect(JSON.parse(JSON.stringify(failure))).toStrictEqual(failure);
  });
});
