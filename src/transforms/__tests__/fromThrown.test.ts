/// <reference types="node" />
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

import { fromThrown } from '../fromThrown.js';

describe('fromThrown', () => {
  it('keeps the message and stack of an Error', () => {
    const error = new Error('boom');

    expect(fromThrown(error)).toStrictEqual({
      success: false,
      code: 'UNKNOWN',
      message: 'boom',
      stack: error.stack,
    });
  });

  it('keeps the message of an Error subclass', () => {
    const error = new TypeError('bad type');

    expect(fromThrown(error)).toMatchObject({ code: 'UNKNOWN', message: 'bad type' });
  });

  it('keeps the message and stack of an Error from another realm', () => {
    const error: unknown = runInNewContext('new TypeError("cross-realm")');

    expect(error).not.toBeInstanceOf(Error);
    expect(fromThrown(error)).toStrictEqual({
      success: false,
      code: 'UNKNOWN',
      message: 'cross-realm',
      stack: (error as Error).stack,
    });
  });

  it('omits the stack when the Error has none', () => {
    const error = new Error('boom');
    Reflect.deleteProperty(error, 'stack');

    expect(fromThrown(error)).toStrictEqual({ success: false, code: 'UNKNOWN', message: 'boom' });
  });

  it('uses a thrown string as the message', () => {
    expect(fromThrown('boom')).toStrictEqual({ success: false, code: 'UNKNOWN', message: 'boom' });
  });

  it.each([
    ['a number', 42],
    ['null', null],
    ['undefined', undefined],
    ['an object', { message: 'boom' }],
  ])('uses a generic message when %s is thrown', (_, thrown) => {
    expect(fromThrown(thrown)).toStrictEqual({
      success: false,
      code: 'UNKNOWN',
      message: 'Non-Error value thrown',
    });
  });
});
