// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn<Args extends any[] = any[], Ret = any> = (...args: Args) => Ret;
type AnyFn = Fn;
type UnknownFn = Fn<unknown[], unknown>;

type ExtractMethodNames<T> = {
  [K in keyof T]: T[K] extends AnyFn ? K : never;
}[keyof T];

type ExtractMethods<T> = Pick<T, ExtractMethodNames<T>>;

export type { AnyFn, ExtractMethodNames, ExtractMethods, Fn, UnknownFn };
