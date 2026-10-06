import { describe, expect, it, vi } from 'vitest';

import { err } from '../../wrappers/err.js';
import { tryCatchAsync } from '../tryCatchAsync.js';

describe('tryCatchAsync', () => {
  it('wraps the resolved value in an Ok', async () => {
    await expect(tryCatchAsync(async () => 42)).resolves.toStrictEqual({ success: true, data: 42 });
  });

  it('converts a rejected Error into an UNKNOWN Err by default', async () => {
    const error = new Error('boom');

    await expect(tryCatchAsync(() => Promise.reject(error))).resolves.toStrictEqual({
      success: false,
      code: 'UNKNOWN',
      message: 'boom',
      stack: error.stack,
    });
  });

  it('converts a rejected non-Error into an UNKNOWN Err by default', async () => {
    await expect(tryCatchAsync(() => Promise.reject('boom'))).resolves.toStrictEqual({
      success: false,
      code: 'UNKNOWN',
      message: 'boom',
    });
  });

  it('catches an error thrown before a promise is returned', async () => {
    const error = new Error('boom');
    const fn = (): Promise<number> => {
      throw error;
    };

    await expect(tryCatchAsync(fn)).resolves.toMatchObject({ success: false, message: 'boom' });
  });

  it('passes the rejection reason to mapError and returns its result', async () => {
    const error = new Error('boom');
    const mapError = vi.fn(() => err({ code: 'FETCH', message: 'Could not fetch' }));

    const result = await tryCatchAsync(() => Promise.reject(error), mapError);

    expect(mapError).toHaveBeenCalledExactlyOnceWith(error);
    expect(result).toStrictEqual({ success: false, code: 'FETCH', message: 'Could not fetch' });
  });

  it('rejects when mapError throws', async () => {
    const mapperError = new Error('mapper');

    await expect(
      tryCatchAsync(
        () => Promise.reject(new Error('boom')),
        () => {
          throw mapperError;
        }
      )
    ).rejects.toThrow(mapperError);
  });

  it('does not call mapError when the promise resolves', async () => {
    const mapError = vi.fn(() => err({ code: 'FETCH', message: 'Could not fetch' }));

    await tryCatchAsync(async () => 42, mapError);

    expect(mapError).not.toHaveBeenCalled();
  });
});
