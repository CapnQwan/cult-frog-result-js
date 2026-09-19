import type { Err } from './_types/err.js';
import type { Ok } from './_types/ok.js';
import type { Result } from './_types/result.js';

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.success;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return !result.success;
}
