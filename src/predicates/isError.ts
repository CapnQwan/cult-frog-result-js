/**
 * Checks whether a value is an `Error`, including an error created in another
 * realm, such as an iframe or a Node `vm` context.
 *
 * Each realm has its own `Error` constructor, so `instanceof Error` fails for
 * errors from another realm. Their built-in tag is still `[object Error]`, so
 * that is checked as a fallback.
 *
 * Used by `fromThrown` to decide whether a thrown value is an error. Not part
 * of the public API.
 *
 * @example
 * ```ts
 * isError(new TypeError('bad type')); // true
 * isError(runInNewContext('new Error("boom")')); // true
 * isError({ message: 'boom' }); // false
 * ```
 *
 * @internal
 * @param value - The value to check.
 * @returns `true` if `value` is an `Error`, otherwise `false`.
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error || Object.prototype.toString.call(value) === '[object Error]';
}
