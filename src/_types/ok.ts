/**
 * The successful variant of a `Result`, holding the value an operation
 * produced.
 *
 * Create one with `ok`. Given a `Result`, narrow to this variant by
 * checking `result.success` or calling `isOk`.
 *
 * @example
 * ```ts
 * const result: Ok<number> = ok(42);
 *
 * result.success; // true
 * result.data; // 42
 * ```
 *
 * @typeParam T - The type of the value produced by the operation.
 */
export interface Ok<T> {
  /** Discriminant that identifies an `Ok`. Always `true`. */
  readonly success: true;
  /** The value produced by the operation. */
  readonly data: T;
}
