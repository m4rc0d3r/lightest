import type { PayloadToSign, SignedPayload } from "../types";

type In<T extends PayloadToSign> = {
  secret: string;
  payload: T;
  lifetime: string;
};

type Out<T extends PayloadToSign> = Promise<{
  payload: T;
  token: string;
}>;

type Fn = <T extends PayloadToSign, U extends SignedPayload<T>>(params: In<T>) => Out<U>;

export type { Fn, In, Out };
