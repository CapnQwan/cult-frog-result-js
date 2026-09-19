import type { Err } from './err.js';
import type { Ok } from './ok.js';

export type Result<T, E = Error> = Ok<T> | Err<E>;
