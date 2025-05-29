import type { UnknownFn } from "~/types/utility";

function createUrl(protocol: string, address: string, port: number) {
  return `${protocol}://${address}:${port}`;
}

function isNullish(value: unknown) {
  return value === null || value === undefined;
}

function isObject(value: unknown) {
  return typeof value === "object" && value !== null;
}

function hasMethod<T extends string>(value: unknown, name: T): value is Record<T, UnknownFn> {
  if (isNullish(value)) return false;

  return (
    (Object.getOwnPropertyNames(value).includes(name) &&
      typeof (value as Record<string, unknown>)[name] === "function") ||
    hasMethod(Object.getPrototypeOf(value), name)
  );
}

export { createUrl, hasMethod, isNullish, isObject };
