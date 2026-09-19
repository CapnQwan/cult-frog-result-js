export interface Ok<T> {
  readonly success: true;
  readonly data: T;
}
