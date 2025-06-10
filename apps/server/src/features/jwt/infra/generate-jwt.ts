import jwt from "jsonwebtoken";

import type { GenerateJwt, PayloadToSign } from "../app";

const generateJwt: GenerateJwt.Fn = async <T extends PayloadToSign, U extends T>({
  secret,
  payload,
  lifetime,
}: GenerateJwt.In<T>) => {
  const clonedPayload = globalThis.structuredClone(payload);
  const token = await new Promise<string>((resolve, reject) =>
    jwt.sign(
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
