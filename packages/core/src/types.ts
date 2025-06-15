// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn<Args extends any[] = any[], Ret = any> = (...args: Args) => Ret;
type UnknownFn = Fn<unknown[], unknown>;

export type { Fn, UnknownFn };
