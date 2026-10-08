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

import type { Result as ResultType } from './_types/index.js';

export * from './functions.js';
export * as Result from './functions.js';

export type * from './_types/index.js';

// `Result` is declared here rather than star-exported so that it merges with
// the `Result` namespace above. A re-exported `Result` type would be hidden by
// the namespace, leaving `Result<T, C>` unusable as a type.
/**
 * The outcome of an operation that can fail: either an `Ok` holding the value
 * it produced, or an `Err` describing why it failed.
 *
 * @typeParam T - The type of the value produced on success.
 * @typeParam C - The error codes the operation can fail with. Defaults to
 * `string`.
 */
export type Result<T, C extends string = string> = ResultType<T, C>;
