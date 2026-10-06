import { describe, expect, it, vi } from 'vitest';

import { err } from '../../wrappers/err.js';
import { tryCatch } from '../tryCatch.js';

describe('tryCatch', () => {
  it('wraps the return value in an Ok', () => {
    expect(tryCatch(() => 42)).toStrictEqual({ success: true, data: 42 });
  });

  it('wraps undefined from a function that returns nothing', () => {
    expect(tryCatch(() => {})).toStrictEqual({ success: true, data: undefined });
  });

  it('calls the function exactly once', () => {
    const fn = vi.fn(() => 42);

    tryCatch(fn);

    expect(fn).toHaveBeenCalledOnce();
  });

  it('converts a thrown Error into an UNKNOWN Err by default', () => {
    const error = new Error('boom');

    expect(
      tryCatch(() => {
        throw error;
      })
    ).toStrictEqual({ success: false, code: 'UNKNOWN', message: 'boom', stack: error.stack });
  });

  it('converts a thrown non-Error into an UNKNOWN Err by default', () => {
    expect(
      tryCatch(() => {
        throw 'boom';
      })
    ).toStrictEqual({ success: false, code: 'UNKNOWN', message: 'boom' });
  });

  it('passes the thrown value to mapError and returns its result', () => {
    const error = new Error('boom');
    const mapError = vi.fn(() => err({ code: 'PARSE', message: 'Could not parse' }));

    const result = tryCatch(() => {
      throw error;
    }, mapError);

    expect(mapError).toHaveBeenCalledExactlyOnceWith(error);
    expect(result).toStrictEqual({ success: false, code: 'PARSE', message: 'Could not parse' });
  });

  it('does not call mapError when the function succeeds', () => {
    const mapError = vi.fn(() => err({ code: 'PARSE', message: 'Could not parse' }));

    tryCatch(() => 42, mapError);

    expect(mapError).not.toHaveBeenCalled();
  });
});
