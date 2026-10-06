import { describe, expect, it } from 'vitest';

import * as api from '../index.js';

describe('package entry point', () => {
  it('exports exactly the public functions', () => {
    expect(Object.keys(api).sort()).toStrictEqual([
      'err',
      'fromThrown',
      'isErr',
      'isOk',
      'ok',
      'tryCatch',
      'tryCatchAsync',
    ]);
  });
});
