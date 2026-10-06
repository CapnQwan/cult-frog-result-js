import { describe, expect, it } from 'vitest';

import { err } from '../err.js';

describe('err', () => {
  it('wraps a code and message in a failed result', () => {
    expect(err({ code: 'NOT_FOUND', message: 'Not found' })).toStrictEqual({
      success: false,
      code: 'NOT_FOUND',
      message: 'Not found',
    });
  });

  it('includes the stack when given', () => {
    const stack = 'Error: Not found\n    at test';

    expect(err({ code: 'NOT_FOUND', message: 'Not found', stack })).toStrictEqual({
      success: false,
      code: 'NOT_FOUND',
      message: 'Not found',
      stack,
    });
  });

  it('omits the stack when not given', () => {
    expect(err({ code: 'NOT_FOUND', message: 'Not found' })).not.toHaveProperty('stack');
  });

  it('accepts empty codes and messages', () => {
    expect(err({ code: '', message: '' })).toStrictEqual({ success: false, code: '', message: '' });
  });

  it('does not keep a reference to the options object', () => {
    const options = { code: 'NOT_FOUND', message: 'Not found' };

    expect(err(options)).not.toBe(options);
  });

  it('returns a plain object that survives a JSON round trip', () => {
    const failure = err({ code: 'NOT_FOUND', message: 'Not found', stack: 'Error: Not found' });

    expect(JSON.parse(JSON.stringify(failure))).toStrictEqual(failure);
  });
});
