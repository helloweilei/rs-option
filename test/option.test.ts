import { describe, it, expect } from 'vitest';
import {
  None,
  Some,
  NoneImpl,
  type Option,

} from '../src/index';

describe('Option - Check Methods', () => {
  it('isSome should return true for Some', () => {
    expect(Some(5).isSome()).toBe(true);
  });

  it('isSome should return false for None', () => {
    expect(None.isSome()).toBe(false);
  });

  it('isNone should return false for Some', () => {
    expect(Some(5).isNone()).toBe(false);
  });

  it('isNone should return true for None', () => {
    expect(None.isNone()).toBe(true);
  });

  it('isSomeAnd should return true when predicate matches', () => {
    expect(Some(5).isSomeAnd((x) => x > 3)).toBe(true);
  });

  it('isSomeAnd should return false when predicate does not match', () => {
    expect(Some(5).isSomeAnd((x) => x > 10)).toBe(false);
  });

  it('isSomeAnd should return false for None', () => {
    expect(None.isSomeAnd(() => true)).toBe(false);
  });
});

describe('Option - Extract Methods', () => {
  it('unwrap should return value for Some', () => {
    expect(Some(5).unwrap()).toBe(5);
  });

  it('unwrap should throw for None', () => {
    expect(() => None.unwrap()).toThrow('called `unwrap()` on a `None` value');
  });

  it('unwrapOr should return value for Some', () => {
    expect(Some(5).unwrapOr(10)).toBe(5);
  });

  it('unwrapOr should return default for None', () => {
    expect(None.unwrapOr(10)).toBe(10);
  });

  it('unwrapOrElse should return value for Some', () => {
    expect(Some(5).unwrapOrElse(() => 10)).toBe(5);
  });

  it('unwrapOrElse should call function for None', () => {
    expect(None.unwrapOrElse(() => 10)).toBe(10);
  });

  it('expect should return value for Some', () => {
    expect(Some(5).expect('test message')).toBe(5);
  });

  it('expect should throw with custom message for None', () => {
    expect(() => None.expect('custom error')).toThrow('custom error');
  });
});

describe('Option - Map Methods', () => {
  it('map should transform Some value', () => {
    expect(Some(5).map((x) => x * 2).unwrap()).toBe(10);
  });

  it('map should keep None as None', () => {
    expect(None.map((x) => x * 2).isNone()).toBe(true);
  });

  it('mapOr should transform Some value', () => {
    expect(Some(5).mapOr(0, (x) => x * 2)).toBe(10);
  });

  it('mapOr should return default for None', () => {
    expect(None.mapOr(0, (x) => x * 2)).toBe(0);
  });

  it('mapOrElse should transform Some value', () => {
    expect(Some(5).mapOrElse(() => 0, (x) => x * 2)).toBe(10);
  });

  it('mapOrElse should call default function for None', () => {
    expect(None.mapOrElse(() => 0, (x) => x * 2)).toBe(0);
  });

  it('inspect should call function for Some and return self', () => {
    let called = false;
    let value = 0;
    const result = Some(5).inspect((x) => {
      called = true;
      value = x;
    });
    expect(called).toBe(true);
    expect(value).toBe(5);
    expect(result.unwrap()).toBe(5);
  });

  it('inspect should not call function for None', () => {
    let called = false;
    None.inspect(() => {
      called = true;
    });
    expect(called).toBe(false);
  });
});

describe('Option - Combinator Methods', () => {
  it('and should return second option for Some', () => {
    expect(Some(5).and(Some(10)).unwrap()).toBe(10);
  });

  it('and should return None for None', () => {
    expect(None.and(Some(10)).isNone()).toBe(true);
  });

  it('andThen should call function for Some', () => {
    expect(Some(5).andThen((x) => Some(x * 2)).unwrap()).toBe(10);
  });

  it('andThen should return None for None', () => {
    expect(None.andThen((x) => Some(x * 2)).isNone()).toBe(true);
  });

  it('or should return self for Some', () => {
    expect(Some(5).or(Some(10)).unwrap()).toBe(5);
  });

  it('or should return second option for None', () => {
    expect(None.or(Some(10)).unwrap()).toBe(10);
  });

  it('orElse should return self for Some', () => {
    expect(Some(5).orElse(() => Some(10)).unwrap()).toBe(5);
  });

  it('orElse should call function for None', () => {
    expect(None.orElse(() => Some(10)).unwrap()).toBe(10);
  });

  it('xor should return Some when only first is Some', () => {
    expect(Some(5).xor(None).unwrap()).toBe(5);
  });

  it('xor should return Some when only second is Some', () => {
    expect(None.xor(Some(5)).unwrap()).toBe(5);
  });

  it('xor should return None when both are None', () => {
    expect(None.xor(None).isNone()).toBe(true);
  });

  it('xor should return None when both are Some', () => {
    expect(Some(5).xor(Some(10)).isNone()).toBe(true);
  });

  it('filter should return Some when predicate matches', () => {
    expect(Some(5).filter((x) => x > 3).unwrap()).toBe(5);
  });

  it('filter should return None when predicate does not match', () => {
    expect(Some(5).filter((x) => x > 10).isNone()).toBe(true);
  });

  it('filter should return None for None', () => {
    expect(None.filter(() => true).isNone()).toBe(true);
  });
});

describe('Option - Insert and Replace Methods', () => {

  it('take should return None for None', () => {
    expect(None.take().isNone()).toBe(true);
  });

  it('replace should return None for None', () => {
    expect(None.replace(10).isNone()).toBe(true);
  });
});

describe('Option - Zip Methods', () => {
  it('zip should combine two Some values', () => {
    const result = Some(5).zip(Some(10)).unwrap();
    expect(result).toEqual([5, 10]);
  });

  it('zip should return None when first is None', () => {
    expect(None.zip(Some(10)).isNone()).toBe(true);
  });

  it('zip should return None when second is None', () => {
    expect(Some(5).zip(None).isNone()).toBe(true);
  });

  it('zipWith should combine two Some values with function', () => {
    const result = Some(5).zipWith(Some(10), (a, b) => a + b).unwrap();
    expect(result).toBe(15);
  });

  it('zipWith should return None when first is None', () => {
    expect(None.zipWith(Some(10), (a, b) => a + b).isNone()).toBe(true);
  });

  it('zipWith should return None when second is None', () => {
    expect(Some(5).zipWith(None as Option<number>, (a, b) => a + b).isNone()).toBe(true);
  });

  it('flatten should flatten nested Some', () => {
    const nested: Option<Option<number>> = Some(Some(5));
    expect(nested.flatten().unwrap()).toBe(5);
  });

  it('flatten should handle nested None', () => {
    const nested: Option<Option<number>> = Some(None);
    expect(nested.flatten().isNone()).toBe(true);
  });

  it('flatten should return None for None', () => {
    const nested: Option<Option<number>> = None;
    expect(nested.flatten().isNone()).toBe(true);
  });
});

describe('Option - Conversion Methods', () => {
  it('cloned should clone object with clone method', () => {
    const obj = { value: 5, clone: () => ({ value: 5, clone: () => ({ value: 5, clone: () => obj }) }) };
    const result = Some(obj).cloned().unwrap();
    expect((result as { value: number }).value).toBe(5);
    expect(result).not.toBe(obj);
  });

  it('cloned should JSON clone objects', () => {
    const obj = { value: 5 };
    const result = Some(obj).cloned<{ value: number }>().unwrap();
    expect(result.value).toBe(5);
    expect(result).not.toBe(obj);
  });

  it('cloned should return None for None', () => {
    expect(None.cloned().isNone()).toBe(true);
  });
});

describe('Option - toString', () => {
  it('toString should return correct string for Some', () => {
    expect(Some(5).toString()).toBe('Some(5)');
  });

  it('toString should return correct string for None', () => {
    expect(None.toString()).toBe('None');
  });
});

describe('None Singleton', () => {
  it('None should be the same instance', () => {
    expect(None).toBe(NoneImpl.getInstance());
  });

  it('None should be singleton', () => {
    const none1 = NoneImpl.getInstance();
    const none2 = NoneImpl.getInstance();
    expect(none1).toBe(none2);
  });
});
