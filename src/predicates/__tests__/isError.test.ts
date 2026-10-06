/// <reference types="node" />
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

import { isError } from '../isError.js';

describe('isError', () => {
  it('returns true for an Error', () => {
    expect(isError(new Error('boom'))).toBe(true);
  });

  it('returns true for an Error subclass', () => {
    expect(isError(new TypeError('bad type'))).toBe(true);
  });

  it('returns true for an Error from another realm', () => {
    const error: unknown = runInNewContext('new Error("cross-realm")');

    expect(error).not.toBeInstanceOf(Error);
    expect(isError(error)).toBe(true);
  });

  it.each([
    ['a string', 'boom'],
    ['a number', 42],
    ['null', null],
    ['undefined', undefined],
    ['an object with a message', { message: 'boom' }],
  ])('returns false for %s', (_, value) => {
    expect(isError(value)).toBe(false);
  });
});
