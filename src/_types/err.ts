/**
 * The failed variant of a `Result`, describing why an operation failed.
 *
 * An `Err` carries a machine-readable `code` for branching on and a
 * human-readable `message` for logging or display. It is a plain, readonly
 * object, so it can be serialized and passed across process or network
 * boundaries without losing information.
 *
 * Create one with `err`. Given a `Result`, narrow to this variant by
 * checking `!result.success` or calling `isErr`.
 *
 * @example
 * ```ts
 * const result: Err<'NOT_FOUND'> = err({
 *   code: 'NOT_FOUND',
 *   message: 'User 42 does not exist',
 * });
 *
 * result.success; // false
 * result.code; // 'NOT_FOUND'
 * result.message; // 'User 42 does not exist'
 * ```
 *
 * @typeParam C - The error code, usually a union of string literals such as
 * `'NOT_FOUND' | 'FORBIDDEN'`. Defaults to `string`.
 */
export interface Err<C extends string = string> {
  /** Discriminant that identifies an `Err`. Always `false`. */
  readonly success: false;
  /**
   * A stable, machine-readable code identifying the kind of failure. Use it to
   * decide how to handle the error.
   */
  readonly code: C;
  /**
   * A human-readable description of the failure, intended for logs and
   * diagnostics.
   */
  readonly message: string;
  /**
   * The stack trace of the error that caused the failure, if one was
   * available. The property is absent, rather than `undefined`, when there is
   * no stack trace.
   */
  readonly stack?: string;
}
