import type { Payload } from "../types";

type In<T extends Payload> = {
  secret: string;
  payload: T;
  lifetime: string;
};

type Out<T extends Payload> = Promise<{
  payload: T;
  token: string;
}>;

type Fn = <T extends Payload, U extends T>(params: In<T>) => Out<U>;

export type { Fn, In, Out };
