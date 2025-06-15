import type { BuildResolver, DisposableResolver } from "awilix";
import { asClass } from "awilix";

import { defineOptions } from "./common";

function asClass2<T = object>(
  Type: Parameters<typeof defineOptions<T>>[0],
  opts?: Parameters<typeof defineOptions<T>>[1],
): BuildResolver<T> & DisposableResolver<T> {
  return asClass(Type, defineOptions(Type, opts));
}

export { asClass2 };
