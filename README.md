# @cult-frog/result

A lightweight, dependency-free `Result` type for explicit, type-safe error handling in TypeScript.

Functions that can fail return a `Result` instead of throwing. A `Result` is either a success holding a value or a failure holding an error code and message. Because failure is part of the return type, the compiler makes callers handle it before they can use the value.

```ts
const result = parsePort(input);

if (result.success) {
  server.listen(result.data);
} else {
  logger.error(`Invalid port (${result.code}): ${result.message}`);
}
```

## Features

- **Type-safe:** results are a discriminated union, so checking `success` narrows to the right variant and checking `code` narrows to the right failure.
- **Coded errors:** failures carry a machine-readable `code` typed as a union of string literals, so every kind of failure is known at compile time.
- **Plain data:** results are plain, readonly objects with no classes or prototypes, so they can be serialized, cloned, logged and sent across process or network boundaries.
- **Bridges throwing code:** `tryCatch` and `tryCatchAsync` turn functions that throw or reject into results.
- **Small:** no runtime dependencies, tree-shakeable, and ships with full type declarations.

## Installation

```sh
pnpm add @cult-frog/result
```

```sh
npm install @cult-frog/result
```

```sh
yarn add @cult-frog/result
```

### Requirements

- Node.js 20.19 or later, or any modern bundler.
- The package is published as an ES module only.
- TypeScript 5.0 or later, if you use TypeScript.

## Quick start

```ts
import { err, ok, type Result } from '@cult-frog/result';

type PortError = 'NOT_AN_INTEGER' | 'OUT_OF_RANGE';

function parsePort(input: string): Result<number, PortError> {
  const port = Number(input);

  if (!Number.isInteger(port)) {
    return err({ code: 'NOT_AN_INTEGER', message: `"${input}" is not an integer` });
  }
  if (port < 0 || port > 65535) {
    return err({ code: 'OUT_OF_RANGE', message: `${port} is not between 0 and 65535` });
  }

  return ok(port);
}

const result = parsePort(process.env.PORT ?? '3000');

if (result.success) {
  console.log(`Listening on port ${result.data}`); // result.data: number
} else {
  console.error(result.message); // result.code: 'NOT_AN_INTEGER' | 'OUT_OF_RANGE'
}
```

## Guide

### The shape of a result

A `Result<T, C>` is one of two plain objects:

```ts
// Success
{ success: true, data: T }

// Failure
{ success: false, code: C, message: string, stack?: string }
```

| Field | Variant | Description |
| --- | --- | --- |
| `success` | Both | `true` for a success, `false` for a failure. Use it to tell the two apart. |
| `data` | `Ok` | The value the operation produced. |
| `code` | `Err` | A stable, machine-readable code identifying the kind of failure. |
| `message` | `Err` | A human-readable description of the failure, for logs and diagnostics. |
| `stack` | `Err` | The stack trace of the error that caused the failure, when one is available. The property is absent, rather than `undefined`, when there is none. |

All fields are `readonly`.

### Creating results

Use `ok` to create a success and `err` to create a failure:

```ts
ok(42);
// { success: true, data: 42 }

err({ code: 'NOT_FOUND', message: 'User 42 does not exist' });
// { success: false, code: 'NOT_FOUND', message: 'User 42 does not exist' }
```

For operations that produce nothing on success, call `ok` with no arguments:

```ts
function deleteUser(id: number): Result<undefined, 'NOT_FOUND'> {
  if (!users.delete(id)) {
    return err({ code: 'NOT_FOUND', message: `User ${id} does not exist` });
  }
  return ok();
}
```

Every value passed to `ok` is a success, including `undefined`, `null`, `false`, `0` and `''`.

### Error codes

`err` infers the code as a string literal, without `as const`:

```ts
const result = err({ code: 'NOT_FOUND', message: 'User 42 does not exist' });
// Err<'NOT_FOUND'>
```

Annotate the return type of a function to declare every code it can fail with. Callers then know the complete set of failures they may need to handle:

```ts
type UserError = 'NOT_FOUND' | 'FORBIDDEN';

function findUser(id: number): Result<User, UserError> {
  const user = users.get(id);
  if (!user) return err({ code: 'NOT_FOUND', message: `User ${id} does not exist` });
  if (!user.visible) return err({ code: 'FORBIDDEN', message: `User ${id} is private` });
  return ok(user);
}
```

When no codes are given, the code type defaults to `string`, so `Result<T>` accepts any code.

### Handling results

Check `success` to narrow a result. On a failure, check `code` to handle each kind of failure:

```ts
const result = findUser(id);

if (!result.success) {
  switch (result.code) {
    case 'NOT_FOUND':
      return response.status(404).send(result.message);
    case 'FORBIDDEN':
      return response.status(403).send(result.message);
  }
}

return response.json(result.data); // result.data: User
```

`data` cannot be read until the result has been narrowed to a success, and `code` and `message` cannot be read until it has been narrowed to a failure.

### Working with collections

`isOk` and `isErr` narrow a result in the same way as checking `success`. They are most useful as callbacks:

```ts
import { isErr, isOk } from '@cult-frog/result';

const results = inputs.map(parsePort); // Result<number, PortError>[]

const ports = results.filter(isOk).map((result) => result.data); // number[]
const failures = results.filter(isErr).map((result) => result.message); // string[]
```

### Wrapping code that throws

Use `tryCatch` to call a function that may throw, such as `JSON.parse` or a third-party library, and get a result back:

```ts
import { tryCatch } from '@cult-frog/result';

const result = tryCatch(() => JSON.parse(input));
// Result<any, 'UNKNOWN'>
```

Use `tryCatchAsync` for functions that return a promise. It catches both rejections and errors thrown before the promise is returned, and the promise it returns always resolves:

```ts
import { tryCatchAsync } from '@cult-frog/result';

const result = await tryCatchAsync(() => fetch(url));
// Result<Response, 'UNKNOWN'>
```

> [!IMPORTANT]
> `tryCatch` does not wait for promises. Passing it an `async` function wraps the promise itself in a success, and any rejection is not caught. Always use `tryCatchAsync` for asynchronous code.

By default, whatever is thrown is converted into a failure with the code `'UNKNOWN'`:

| Thrown value | `message` | `stack` |
| --- | --- | --- |
| An `Error`, an instance of a subclass, or an error from another realm (such as an iframe or a Node `vm` context) | The error's `message` | The error's `stack`, if it has one |
| A string | The string | Not included |
| Anything else | `'Non-Error value thrown'` | Not included |

### Custom error mapping

Pass a `mapError` function as the second argument to give failures meaningful codes. It receives the thrown value as `unknown`, because JavaScript allows any value to be thrown, and must return an `Err`:

```ts
import { err, tryCatchAsync } from '@cult-frog/result';

const result = await tryCatchAsync(
  () => fetch(url),
  (thrown) =>
    err({
      code: 'NETWORK_ERROR',
      message: thrown instanceof Error ? thrown.message : `Could not reach ${url}`,
    })
);
// Result<Response, 'NETWORK_ERROR'>
```

The codes returned by `mapError` become the codes of the result. `mapError` is only called when the function throws or rejects.

### Serialization

Results are plain objects with no classes or prototypes, so they can be returned from API handlers, sent between workers, or stored like any other data:

```ts
const result = err({ code: 'NOT_FOUND', message: 'User 42 does not exist' });

JSON.parse(JSON.stringify(result));
// { success: false, code: 'NOT_FOUND', message: 'User 42 does not exist' }
```

A failure always round-trips unchanged. A success round-trips as well as its `data` does: `structuredClone` and `postMessage` keep any cloneable value, but `JSON.stringify` follows the usual JSON rules, so a `Date` comes back as a string and `ok()` comes back without its `data` key.

> [!NOTE]
> Failures converted from thrown values by `tryCatch`, `tryCatchAsync` and `fromThrown` include the original stack trace, which is useful for debugging but can reveal file paths and other internals. Remove `stack` before sending a result outside your system, for example to an API client:
>
> ```ts
> const { stack, ...publicResult } = result;
> ```

## API reference

### Types

#### `Result<T, C extends string = string>`

The outcome of an operation that can fail: `Ok<T> | Err<C>`.

- `T`: the type of the value produced on success.
- `C`: the error codes the operation can fail with. Defaults to `string`.

#### `Ok<T>`

The successful variant of a `Result`.

```ts
interface Ok<T> {
  readonly success: true;
  readonly data: T;
}
```

#### `Err<C extends string = string>`

The failed variant of a `Result`.

```ts
interface Err<C extends string = string> {
  readonly success: false;
  readonly code: C;
  readonly message: string;
  readonly stack?: string;
}
```

### Functions

#### `ok()`

```ts
function ok(): Ok<undefined>;
function ok<T>(data: T): Ok<T>;
```

Creates a successful result holding `data`, or `undefined` when called with no arguments. The value is stored as is, without copying.

#### `err(options)`

```ts
function err<const C extends string = string>(options: {
  code: C;
  message: string;
  stack?: string;
}): Err<C>;
```

Creates a failed result from an error code and message. The code is inferred as a string literal. `stack` is only included when it is provided.

#### `isOk(result)`

```ts
function isOk<T, C extends string>(result: Result<T, C>): result is Ok<T>;
```

Returns `true` if `result` is a success, narrowing it to `Ok<T>`.

#### `isErr(result)`

```ts
function isErr<T, C extends string>(result: Result<T, C>): result is Err<C>;
```

Returns `true` if `result` is a failure, narrowing it to `Err<C>`.

#### `tryCatch(fn, mapError?)`

```ts
function tryCatch<T>(fn: () => T): Result<T, 'UNKNOWN'>;
function tryCatch<T, C extends string>(
  fn: () => T,
  mapError: (thrown: unknown) => Err<C>
): Result<T, C>;
```

Calls `fn` immediately and returns its value as a success. If `fn` throws, returns the result of `mapError`, or a failure with the code `'UNKNOWN'` when no `mapError` is given. Does not wait for promises; use `tryCatchAsync` for asynchronous functions.

#### `tryCatchAsync(fn, mapError?)`

```ts
function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, 'UNKNOWN'>>;
function tryCatchAsync<T, C extends string>(
  fn: () => Promise<T>,
  mapError: (thrown: unknown) => Err<C>
): Promise<Result<T, C>>;
```

Calls `fn` immediately and resolves to its resolved value as a success. If `fn` rejects or throws, resolves to the result of `mapError`, or a failure with the code `'UNKNOWN'` when no `mapError` is given. The returned promise does not reject unless `mapError` throws.

## License

[MIT](LICENSE)
