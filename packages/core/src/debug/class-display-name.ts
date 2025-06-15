import type { Class } from "type-fest";

const DISPLAY_NAME = Symbol("DISPLAY_NAME");

function set(value: string) {
  return function (class_: unknown) {
    Object.defineProperty(class_, DISPLAY_NAME, {
      value,
    });
  };
}

function get<T, Arguments extends unknown[] = unknown[]>(class_: Class<T, Arguments>) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value } = Object.getOwnPropertyDescriptor(class_, DISPLAY_NAME) ?? {};
  return typeof value === "string" ? value : null;
}

export { get, set };
