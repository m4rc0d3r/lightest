function isFalsy(value: unknown): value is null | undefined | false | 0 | 0n | "" {
  return !value;
}

function isTruthy(value: unknown): value is Exclude<typeof value, ReturnType<typeof isFalsy>> {
  return !isFalsy(value);
}

export { isFalsy, isTruthy };
