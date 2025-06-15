type Falsy = null | undefined | false | 0 | 0n | "";
type Truthy = Exclude<unknown, Falsy>;

function isFalsy(value: unknown): value is Falsy {
  return !value;
}

function isTruthy(value: unknown): value is Truthy {
  return !isFalsy(value);
}

export { isFalsy, isTruthy };
export type { Falsy, Truthy };
