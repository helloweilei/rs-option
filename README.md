# rs-option

A TypeScript implementation of Rust's `Option<T>` type, providing a safe and expressive way to handle optional values without null or undefined.

## Features

- ✅ Full Rust `Option<T>` API compatibility
- 🎯 Type-safe optional value handling
- 🔄 Functional programming patterns
- 📦 Zero dependencies
- 🚀 CommonJS and ESM support
- 🧪 Comprehensive test coverage

## Installation

```bash
npm install rs-option
```

## Quick Start

```typescript
import { Some, None } from 'rs-option';

// Create Some
const value = Some(42);
console.log(value.isSome()); // true
console.log(value.unwrap()); // 42

// Create None
const empty = None;
console.log(empty.isNone()); // true
```

## API Reference

### Creating Options

#### `Some<T>(value: T): Option<T>`

Creates an `Option` containing a value.

```typescript
const x = Some(5);
```

#### `None: Option<never>`

Represents the absence of a value (singleton instance).

```typescript
const y = None;
```

### Check Methods

#### `isSome(): boolean`

Returns `true` if the option is a `Some` value.

```typescript
Some(5).isSome(); // true
None.isSome();    // false
```

#### `isNone(): boolean`

Returns `true` if the option is a `None` value.

```typescript
Some(5).isNone(); // false
None.isNone();    // true
```

#### `isSomeAnd(predicate: (value: T) => boolean): boolean`

Returns `true` if the option is `Some` and the value inside matches a predicate.

```typescript
Some(5).isSomeAnd(x => x > 3); // true
Some(2).isSomeAnd(x => x > 3); // false
None.isSomeAnd(() => true);    // false
```

### Extract Methods

#### `unwrap(): T`

Returns the contained `Some` value. Throws an error if the option is `None`.

```typescript
Some(5).unwrap();   // 5
None.unwrap();       // throws: "called `unwrap()` on a `None` value"
```

#### `unwrapOr(defaultValue: T): T`

Returns the contained `Some` value or a provided default.

```typescript
Some(5).unwrapOr(10); // 5
None.unwrapOr(10);     // 10
```

#### `unwrapOrElse(fn: () => T): T`

Returns the contained `Some` value or computes a default from a function.

```typescript
Some(5).unwrapOrElse(() => 10); // 5
None.unwrapOrElse(() => 10);     // 10
```

#### `expect(message: string): T`

Returns the contained `Some` value or throws with a custom message if `None`.

```typescript
Some(5).expect("value missing");  // 5
None.expect("value missing");     // throws: "value missing"
```

### Map Methods

#### `map<U>(fn: (value: T) => U): Option<U>`

Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.

```typescript
Some(5).map(x => x * 2); // Some(10)
None.map(x => x * 2);     // None
```

#### `mapOr<U>(defaultValue: U, fn: (value: T) => U): U`

Returns the provided default result (if none), or applies a function to the contained value.

```typescript
Some(5).mapOr(0, x => x * 2); // 10
None.mapOr(0, x => x * 2);     // 0
```

#### `mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U`

Computes a default function result (if none), or applies a different function to the contained value.

```typescript
Some(5).mapOrElse(() => 0, x => x * 2); // 10
None.mapOrElse(() => 0, x => x * 2);     // 0
```

#### `inspect(fn: (value: T) => void): Option<T>`

Calls the provided closure with a reference to the contained value (if Some), then returns the option.

```typescript
Some(5).inspect(x => console.log(x)); // prints 5, returns Some(5)
None.inspect(x => console.log(x));     // returns None
```

### Combinator Methods

#### `and<U>(optb: Option<U>): Option<U>`

Returns `None` if the option is `None`, otherwise returns `optb`.

```typescript
Some(2).and(Some(5)); // Some(5)
None.and(Some(5));     // None
```

#### `andThen<U>(fn: (value: T) => Option<U>): Option<U>`

Calls `fn` if the option is `Some`, otherwise returns `None`.

```typescript
Some(2).andThen(x => Some(x * 2)); // Some(4)
None.andThen(x => Some(x * 2));     // None
```

#### `or(optb: Option<T>): Option<T>`

Returns the option if it contains a value, otherwise returns `optb`.

```typescript
Some(2).or(Some(5)); // Some(2)
None.or(Some(5));     // Some(5)
```

#### `orElse(fn: () => Option<T>): Option<T>`

Returns the option if it contains a value, otherwise calls `fn`.

```typescript
Some(2).orElse(() => Some(5)); // Some(2)
None.orElse(() => Some(5));     // Some(5)
```

#### `xor(optb: Option<T>): Option<T>`

Returns `Some` if exactly one of self or `optb` is `Some`, otherwise returns `None`.

```typescript
Some(2).xor(Some(5)); // None
Some(2).xor(None);    // Some(2)
None.xor(Some(5));    // Some(5)
None.xor(None);       // None
```

#### `filter(predicate: (value: T) => boolean): Option<T>`

Returns `None` if the option is `None`, otherwise calls `predicate` with the wrapped value and returns:
- `Some(t)` if `predicate(t)` returns `true`
- `None` if `predicate(t)` returns `false`

```typescript
Some(5).filter(x => x > 3); // Some(5)
Some(2).filter(x => x > 3); // None
None.filter(() => true);     // None
```

#### `take(): Option<T>`

Takes the value out of the option, leaving a unusable value.

```typescript
const x = Some(5);
const y = x.take(); // Some(5)
// x.value is never, do not use later.
```

#### `replace(value: T): Option<T>`

Replaces the actual value in the option by the value given, and returns the old value.

```typescript
const x = Some(2);
const old = x.replace(5); // Some(2)
// x now contains Some(5)
```

### Zip Methods

#### `zip<U>(other: Option<U>): Option<[T, U]>`

Zips `self` with another `Option`.

```typescript
Some(5).zip(Some(10)); // Some([5, 10])
Some(5).zip(None);      // None
None.zip(Some(10));      // None
```

#### `zipWith<U, R>(other: Option<U>, fn: (a: T, b: U) => R): Option<R>`

Zips `self` and another `Option` with function `fn`.

```typescript
Some(5).zipWith(Some(10), (a, b) => a + b); // Some(15)
```

#### `flatten<U>(this: Option<Option<U>>): Option<U>`

Converts from `Option<Option<T>>` to `Option<T>`.

```typescript
Some(Some(5)).flatten(); // Some(5)
Some(None).flatten();    // None
None.flatten();          // None
```

### Conversion Methods

#### `cloned<U>(): Option<U>`

Clones the contained value (for objects with a `clone` method or deep clones via JSON).

```typescript
const obj = { value: 5 };
Some(obj).cloned(); // Some({ value: 5 })
```

## Usage Examples

### Safe Optional Access

```typescript
function findUser(id: number): Option<User> {
  const user = database.find(id);
  return user ? Some(user) : None;
}

const user = findUser(123);
if (user.isSome()) {
  console.log(`User: ${user.unwrap().name}`);
}
```

### Chaining Operations

```typescript
Some(5)
  .map(x => x * 2)
  .map(x => x + 1)
  .filter(x => x > 5)
  .unwrap(); // 11
```

### Default Values

```typescript
const config = Some(8080);
const port = config.unwrapOr(3000); // 8080

const empty = None;
const port = empty.unwrapOr(3000);  // 3000
```

### Error Handling with Result

```typescript
function parseConfig(input: string): Result<Config, Error> {
  try {
    const config = JSON.parse(input);
    //...
  } catch (e) {
    // Handle error
  }
}
```

### Combining Options

```typescript
const name = Some("Alice");
const age = Some(30);

const person = name.zip(age).map(([n, a]) => ({ name: n, age: a }));
// Some({ name: "Alice", age: 30 })
```

## Building

```bash
npm run build
```

This creates:
- `dist/index.cjs` - CommonJS format
- `dist/index.mjs` - ES Module format
- `dist/index.d.ts` - TypeScript definitions

## Testing

```bash
# Run tests in watch mode
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Inspired by Rust's `Option<T>` type from the standard library.
