import { describe, expect, it } from 'vitest';

import * as api from '../index.js';

const functionNames = ['err', 'fromThrown', 'isErr', 'isOk', 'ok', 'tryCatch', 'tryCatchAsync'];

describe('package entry point', () => {
  it('exports exactly the public functions and the Result namespace', () => {
    expect(Object.keys(api).sort()).toStrictEqual(['Result', ...functionNames].sort());
  });

  it('exposes exactly the public functions on the Result namespace', () => {
    expect(Object.keys(api.Result).sort()).toStrictEqual(functionNames);
  });

  it('exposes the same functions on the Result namespace as the named exports', () => {
    expect(api.Result.err).toBe(api.err);
    expect(api.Result.fromThrown).toBe(api.fromThrown);
    expect(api.Result.isErr).toBe(api.isErr);
    expect(api.Result.isOk).toBe(api.isOk);
    expect(api.Result.ok).toBe(api.ok);
    expect(api.Result.tryCatch).toBe(api.tryCatch);
    expect(api.Result.tryCatchAsync).toBe(api.tryCatchAsync);
  });
});
