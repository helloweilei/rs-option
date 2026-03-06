/**
 * Option
 *
 * A type that represents either a value or the absence of a value.
 * It has the same declaration as Rust's Option<T>
 */

export interface Option<T> {
    // Check methods
    isSome(): boolean;
    isNone(): boolean;
    isSomeAnd(predicate: (value: T) => boolean): boolean;

    // Extract methods
    unwrap(): T;
    unwrapOr(defaultValue: T): T;
    unwrapOrElse(fn: () => T): T;
    expect(message: string): T;

    // Map methods
    map<U>(fn: (value: T) => U): Option<U>;
    mapOr<U>(defaultValue: U, fn: (value: T) => U): U;
    mapOrElse<U>(defaultFn: () => U, fn: (value: T) => U): U;
    inspect(fn: (value: T) => void): Option<T>;

    // Combinator methods
    and<U>(optb: Option<U>): Option<U>;
    andThen<U>(fn: (value: T) => Option<U>): Option<U>;
    or(optb: Option<T>): Option<T>;
    orElse(fn: () => Option<T>): Option<T>;
    xor(optb: Option<T>): Option<T>;
    filter(predicate: (value: T) => boolean): Option<T>;

    // replace methods
    take(): Option<T>;
    replace(value: T): Option<T>;

    // Zip methods
    zip<U>(other: Option<U>): Option<[T, U]>;
    zipWith<U, R>(other: Option<U>, fn: (a: T, b: U) => R): Option<R>;
    flatten<U>(this: Option<Option<U>>): Option<U>;

    // Conversion methods
    cloned(): Option<T>;
}

/**
 * None implementation
 */
export class NoneImpl implements Option<never> {
    private static instance: NoneImpl = new NoneImpl();

    private constructor() { }

    static getInstance(): NoneImpl {
        return this.instance;
    }

    // Check methods
    isSome(): boolean {
        return false;
    }

    isNone(): boolean {
        return true;
    }

    isSomeAnd(_predicate: (value: never) => boolean): boolean {
        return false;
    }

    // Extract methods
    unwrap(): never {
        throw new Error("called `unwrap()` on a `None` value");
    }

    unwrapOr<T>(defaultValue: T): T {
        return defaultValue;
    }

    unwrapOrElse<T>(fn: () => T): T {
        return fn();
    }

    expect(message: string): never {
        throw new Error(message);
    }

    map<U>(_fn: (value: never) => U): Option<U> {
        return NoneImpl.getInstance();
    }

    mapOr<U>(defaultValue: U, _fn: (value: never) => U): U {
        return defaultValue;
    }

    mapOrElse<U>(defaultFn: () => U, _fn: (value: never) => U): U {
        return defaultFn();
    }

    inspect(_fn: (value: never) => void): Option<never> {
        return this;
    }

    // Combinator methods
    and<U>(_optb: Option<U>): Option<U> {
        return NoneImpl.getInstance();
    }

    andThen<U>(_fn: (value: never) => Option<U>): Option<U> {
        return NoneImpl.getInstance();
    }

    or<T>(optb: Option<T>): Option<T> {
        if (optb.isSome()) {
            return optb;
        }
        return NoneImpl.getInstance();
    }

    orElse<T>(fn: () => Option<T>): Option<T> {
        return fn();
    }

    xor<T>(_optb: Option<T>): Option<T> {
        return _optb;
    }

    filter(_predicate: (value: never) => boolean): Option<never> {
        return this;
    }

    take(): Option<never> {
        return this;
    }

    replace<T>(value: T): Option<T> {
        return NoneImpl.getInstance();
    }

    // Zip methods
    zip<U>(_other: Option<U>): Option<[never, U]> {
        return NoneImpl.getInstance();
    }

    zipWith<U, R>(_other: Option<U>, _fn: (a: never, b: U) => R): Option<R> {
        return NoneImpl.getInstance();
    }

    flatten<U>(): Option<U> {
        return NoneImpl.getInstance();
    }

    // Conversion methods
    cloned(): Option<never> {
        return NoneImpl.getInstance();
    }

    toString(): string {
        return "None";
    }
}

/**
 * Some implementation
 */
export class SomeImpl<T> implements Option<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    // Check methods
    isSome(): boolean {
        return true;
    }

    isNone(): boolean {
        return false;
    }

    isSomeAnd(predicate: (value: T) => boolean): boolean {
        return predicate(this.value);
    }

    // Extract methods
    unwrap(): T {
        return this.value;
    }

    unwrapOr(_defaultValue: T): T {
        return this.value;
    }

    unwrapOrElse(_fn: () => T): T {
        return this.value;
    }

    expect(_message: string): T {
        return this.value;
    }

    // Map methods
    map<U>(fn: (value: T) => U): Option<U> {
        return new SomeImpl(fn(this.value));
    }

    mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
        return fn(this.value);
    }

    mapOrElse<U>(_defaultFn: () => U, fn: (value: T) => U): U {
        return fn(this.value);
    }

    inspect(fn: (value: T) => void): Option<T> {
        fn(this.value);
        return this;
    }

    // Combinator methods
    and<U>(optb: Option<U>): Option<U> {
        return optb;
    }

    andThen<U>(fn: (value: T) => Option<U>): Option<U> {
        return fn(this.value);
    }

    or(_optb: Option<T>): Option<T> {
        return this;
    }

    orElse(_fn: () => Option<T>): Option<T> {
        return this;
    }

    xor(optb: Option<T>): Option<T> {
        if (optb.isNone()) {
            return this;
        }
        return NoneImpl.getInstance();
    }

    filter(predicate: (value: T) => boolean): Option<T> {
        if (predicate(this.value)) {
            return this;
        }
        return NoneImpl.getInstance();
    }

    take(): Option<T> {
        const value = this.value;
        this.value = null as never;
        return new SomeImpl(value);
    }

    replace(value: T): Option<T> {
        const oldValue = this.value;
        this.value = value;
        return new SomeImpl(oldValue);
    }

    // Zip methods
    zip<U>(other: Option<U>): Option<[T, U]> {
        if (other.isSome()) {
            return new SomeImpl([this.value, (other as SomeImpl<U>).unwrap()]);
        }
        return NoneImpl.getInstance();
    }

    zipWith<U, R>(other: Option<U>, fn: (a: T, b: U) => R): Option<R> {
        if (other.isSome()) {
            return new SomeImpl(fn(this.value, (other as SomeImpl<U>).unwrap()));
        }
        return NoneImpl.getInstance();
    }



    flatten<U>(this: SomeImpl<Option<U>>): Option<U> {
        if (this.value instanceof SomeImpl || this.value instanceof NoneImpl) {
            return this.value as unknown as Option<U>;
        }
        throw new Error("called `flatten()` on non SomeImpl<Option<U>>");
    }

    // Conversion methods
    cloned(): Option<T> {
        try {
            if (typeof structuredClone === "function") {
                return new SomeImpl(structuredClone(this.value));
            }
            return new SomeImpl(deepClone(this.value));
        } catch (e) {
            return new SomeImpl(deepClone(this.value));
        }
    }

    toString(): string {
        return `Some(${JSON.stringify(this.value)})`;
    }
}


function deepClone<T>(value: T): T {
    if (typeof value === "object" && value !== null) {
        if ("clone" in value && typeof value.clone === "function") {
            return (value as unknown as { clone(): T }).clone();
        }
        return JSON.parse(JSON.stringify(value)) as T;
    }
    return value;
}

/**
 * Helper functions
 */
export const None = NoneImpl.getInstance();

export function Some<T>(value: T): Option<T> {
    return new SomeImpl(value);
}
