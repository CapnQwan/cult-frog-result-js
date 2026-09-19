# @cult-frog/result

A lightweight TypeScript `Result<T, E>` type for explicit, type-safe error handling without exceptions.

A `Result` is a plain object that is either a success holding a value or a failure holding an error. Because failures are part of the return type, callers have to handle them before they can use the value.

## Install

```sh
pnpm add @cult-frog/result
```

## Usage

```ts
import { err, ok, type Result } from '@cult-frog/result';

function parsePort(input: string): Result<number> {
  const port = Number(input);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    return err(new Error(`Invalid port: ${input}`));
  }
  return ok(port);
}

const result = parsePort(process.env.PORT ?? '3000');

if (result.success) {
  console.log(`Listening on ${result.data}`); // result.data: number
} else {
  console.error(result.error.message); // result.error: Error
}
```

Results are plain, readonly objects, so they can be serialized, compared and passed across boundaries like any other data:

```ts
ok(42);                     // { success: true, data: 42 }
err(new Error('Not found')); // { success: false, error: Error }
```

### Custom error types

The error type defaults to `Error`, but it can be anything:

```ts
type ParseError = { code: 'EMPTY' } | { code: 'NOT_A_NUMBER'; input: string };

function parse(input: string): Result<number, ParseError> {
  if (input === '') return err({ code: 'EMPTY' });
  const value = Number(input);
  if (Number.isNaN(value)) return err({ code: 'NOT_A_NUMBER', input });
  return ok(value);
}
```

## API

### Types

| Type | Description |
| --- | --- |
| `Result<T, E = Error>` | `Ok<T> \| Err<E>`. The `success` field tells the two apart. |
| `Ok<T>` | `{ readonly success: true; readonly data: T }` |
| `Err<E = Error>` | `{ readonly success: false; readonly error: E }` |

### Constructors

| Function | Description |
| --- | --- |
| `ok(data)` | Wraps `data` in an `Ok`. |
| `err(error)` | Wraps `error` in an `Err`. |

### Predicates

| Function | Description |
| --- | --- |
| `isOk(result)` | Returns `true` and narrows to `Ok<T>` if the result succeeded. |
| `isErr(result)` | Returns `true` and narrows to `Err<E>` if the result failed. |

Checking `result.success` narrows the type in the same way. The predicates are most useful as callbacks:

```ts
const values = results.filter(isOk).map((r) => r.data);
const errors = results.filter(isErr).map((r) => r.error);
```

## License

MIT
