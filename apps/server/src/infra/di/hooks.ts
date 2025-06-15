import type { AwilixContainer } from "awilix";

type AsyncInit = {
  asyncInit(diContainer: AwilixContainer): Promise<unknown>;
};

type AsyncDispose = {
  asyncDispose(): Promise<unknown>;
};

export type { AsyncDispose, AsyncInit };
