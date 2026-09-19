import type { Err } from './_types/err.js';
import type { Ok } from './_types/ok.js';

export function ok<T>(data: T): Ok<T> {
  return { success: true, data };
}

export function err<E = Error>(error: E): Err<E> {
  return { success: false, error };
}
