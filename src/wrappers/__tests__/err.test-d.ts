import { describe, expectTypeOf, it } from 'vitest';

import { err } from '../err.js';
import { ok } from '../ok.js';

import type { Err, Result } from '../../_types/index.js';

describe('err', () => {
  it('infers the code as a literal', () => {
    expectTypeOf(err({ code: 'NOT_FOUND', message: '' })).toEqualTypeOf<Err<'NOT_FOUND'>>();
  });

  it('accepts an explicit union of codes', () => {
    expectTypeOf(err<'EMPTY' | 'NOT_A_NUMBER'>({ code: 'EMPTY', message: '' })).toEqualTypeOf<
      Err<'EMPTY' | 'NOT_A_NUMBER'>
    >();
  });

  it('accepts an optional stack', () => {
    expectTypeOf(err({ code: 'NOT_FOUND', message: '', stack: '' })).toEqualTypeOf<
      Err<'NOT_FOUND'>
    >();
  });

  it('rejects invalid options', () => {
    // @ts-expect-error `message` is required
    err({ code: 'NOT_FOUND' });
    // @ts-expect-error `code` is required
    err({ message: '' });
    // @ts-expect-error `code` must be a string
    err({ code: 404, message: '' });
    // @ts-expect-error `success` is set by err
    err({ success: false, code: 'NOT_FOUND', message: '' });
    // @ts-expect-error options are required
    err();
  });

  it('is assignable to a Result with the same code or the default code', () => {
    expectTypeOf(err({ code: 'NOT_FOUND', message: '' })).toExtend<Result<number, 'NOT_FOUND'>>();
    expectTypeOf(err({ code: 'NOT_FOUND', message: '' })).toExtend<Result<number>>();
  });

  it('is not assignable to a Result with a different code', () => {
    expectTypeOf(err({ code: 'NOT_FOUND', message: '' })).not.toExtend<Result<number, 'EMPTY'>>();
  });

  it('can be returned from a function annotated with a union of codes', () => {
    function parse(input: string): Result<number, 'EMPTY' | 'NOT_A_NUMBER'> {
      if (input === '') return err({ code: 'EMPTY', message: 'Input is empty' });
      const value = Number(input);
      if (Number.isNaN(value)) return err({ code: 'NOT_A_NUMBER', message: input });
      return ok(value);
    }

    expectTypeOf(parse).returns.toEqualTypeOf<Result<number, 'EMPTY' | 'NOT_A_NUMBER'>>();
  });
});
