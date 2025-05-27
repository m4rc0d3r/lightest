import type { ConditionalKeys } from "type-fest";

import type { AnyFn, Fn } from "~/types/utility";

function withIgnoringPromise<T extends object, K extends ConditionalKeys<T, AnyFn>>(
  instance: T,
  methodName: K,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): T[K] extends Fn<any[], Promise<unknown>> ? (...args: Parameters<T[K]>) => void : never {
  const fn = instance[methodName];
  if (typeof fn !== "function") throw new TypeError("The method name must refer to a function.");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((...args) => void fn.apply(instance, args)) as T[K] extends Fn<any[], Promise<unknown>>
    ? (...args: Parameters<T[K]>) => void
    : never;
}

export { withIgnoringPromise };
