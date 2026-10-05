/**
 * The failed variant of a `Result`.
 *
 * Narrow to this variant with `!result.success` or `isErr`.
 *
 * @typeParam E - The type of the error value. Defaults to `Error`.
 */
export interface Err<C extends string = string> {
  /** Discriminant, always `false` for an `Err`. */
  readonly success: false;
  /** The code describing why the operation failed. */
  readonly code: C;
  /** The message describing why the operation failed. */
  readonly message: string;
  /** The stack trace describing why the operation failed. */
  readonly stack?: string;
}
