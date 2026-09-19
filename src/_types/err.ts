/**
 * The failed variant of a `Result`.
 *
 * Narrow to this variant with `!result.success` or `isErr`.
 *
 * @typeParam E - The type of the error value. Defaults to `Error`.
 */
export interface Err<E = Error> {
  /** Discriminant, always `false` for an `Err`. */
  readonly success: false;
  /** The error describing why the operation failed. */
  readonly error: E;
}
