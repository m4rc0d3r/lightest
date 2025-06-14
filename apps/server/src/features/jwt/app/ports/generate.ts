import type { UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

import type { PayloadToSign, SignedPayload } from "../types";

type In<T extends PayloadToSign> = {
  secret: string;
  payload: T;
  lifetime: string;
};

type Out<T extends PayloadToSign> = taskEither.TaskEither<
  UnexpectedError,
  {
    payload: SignedPayload<T>;
    token: string;
  }
>;

type Fn<T extends PayloadToSign = PayloadToSign, U extends SignedPayload<T> = SignedPayload<T>> = (
  params: In<T>,
) => Out<U>;

export type { Fn, In, Out };
