export interface Err<E = Error> {
  readonly success: false;
  readonly error: E;
}
