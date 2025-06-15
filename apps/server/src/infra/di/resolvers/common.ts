import type { Fn } from "@lightest/core";
import { TypeGuard } from "@lightest/core";
import type { AwilixContainer, BuildResolverOptions, Constructor } from "awilix";

import type { AsyncDispose, AsyncInit } from "../hooks";

function defineOptions<T = object>(
  Type: Constructor<T>,
  opts?: Omit<BuildResolverOptions<T>, "asyncInit" | "asyncDispose"> & {
    asyncInitWrapper?:
      | (<U extends T>(
          instance: U,
          diContainer: AwilixContainer,
          asyncInit?: () => Promise<unknown>,
        ) => Promise<unknown>)
      | undefined;
    asyncDisposeWrapper?:
      | (<U extends T>(instance: U, asyncDispose?: () => Promise<unknown>) => Promise<unknown>)
      | undefined;
  },
): BuildResolverOptions<T> {
  const { asyncInitWrapper, asyncDisposeWrapper, ...opts_ } = opts ?? {};

  return {
    asyncInit:
      typeof asyncInitWrapper === "function"
        ? ((async (instance, diContainer) => {
            await asyncInitWrapper(
              instance,
              diContainer,
              TypeGuard.hasMethod(instance, "asyncInit")
                ? async () => (instance as AsyncInit).asyncInit(diContainer)
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncInit"], Fn>)
        : TypeGuard.hasMethod(Type.prototype, "asyncInit"),
    asyncDispose:
      typeof asyncDisposeWrapper === "function"
        ? ((async (instance) => {
            await asyncDisposeWrapper(
              instance,
              TypeGuard.hasMethod(instance, "asyncDispose")
                ? async () => (instance as AsyncDispose).asyncDispose()
                : undefined,
            );
          }) satisfies Extract<BuildResolverOptions<T>["asyncDispose"], Fn>)
        : TypeGuard.hasMethod(Type.prototype, "asyncDispose"),
    ...opts_,
  };
}

export { defineOptions };
