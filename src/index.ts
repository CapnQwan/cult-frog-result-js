/**
 * A lightweight `Result` type for explicit, type-safe error handling in
 * TypeScript.
 *
 * A `Result` is either an `Ok` holding a value or an `Err` describing a
 * failure with a code and message. Results are plain, readonly objects, so
 * they can be serialized and passed across boundaries like any other data.
 *
 * @packageDocumentation
 */

export * from './predicates/index.js';
export * from './transforms/index.js';
export * from './tryCatch/index.js';
export * from './wrappers/index.js';

export type * from './_types/index.js';
