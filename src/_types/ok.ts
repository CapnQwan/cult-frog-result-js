/**
 * The successful variant of a `Result`.
 *
 * Narrow to this variant with `result.success` or `isOk`.
 *
 * @typeParam T - The type of the success value.
 */
export interface Ok<T> {
  /** Discriminant, always `true` for an `Ok`. */
  readonly success: true;
  /** The value produced by the successful operation. */
  readonly data: T;
}
