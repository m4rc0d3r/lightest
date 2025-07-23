function isOneOf<T extends unknown[]>(value: unknown, values: T): value is T[number] {
  return values.includes(value);
}

export { isOneOf };
