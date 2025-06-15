import type { BuildResolver, DisposableResolver, FunctionReturning } from "awilix";
import { asFunction } from "awilix";

import { defineOptions } from "./common";

function asFunction2<T = object>(
  Type: Parameters<typeof defineOptions<T>>[0],
  fn: FunctionReturning<T>,
  opts?: Parameters<typeof defineOptions<T>>[1],
): BuildResolver<T> & DisposableResolver<T> {
  return asFunction(fn, defineOptions(Type, opts));
}

export { asFunction2 };
