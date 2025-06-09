import { sign } from "jsonwebtoken";

import type { GenerateJwt, Payload } from "../app";

const generateJwt: GenerateJwt.Fn = async <T extends Payload, U extends T>({
  secret,
  payload,
  lifetime,
}: GenerateJwt.In<T>) => {
  const clonedPayload = globalThis.structuredClone(payload);
  const token = await new Promise<string>((resolve, reject) =>
    sign(
      clonedPayload,
      secret,
      {
        expiresIn: lifetime,
        mutatePayload: true,
      },
      (error, encoded) => (error === null ? resolve(encoded!) : reject(error)),
    ),
  );
  return { token, payload: clonedPayload as unknown as U };
};

export { generateJwt };
