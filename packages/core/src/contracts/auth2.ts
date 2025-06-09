import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { getErrorWithHttpStatusCode, zUniqueKeyViolationError } from "./error-schemas";

import { zUser } from "~/domain";

const zRegisterReq = zUser.pick({
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  password: true,
});

const zMe = zUser.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  password: true,
  verificationCode: true,
  createdAt: true,
});

const zRegisterSuccessfulRes = z.object({
  accessToken: z.string().jwt(),
  me: zMe,
});

const c = initContract();
const auth2Contract = c.router(
  {
    register: {
      method: "POST",
      path: "/register",
      body: zRegisterReq,
      responses: {
        201: zRegisterSuccessfulRes,
        ...getErrorWithHttpStatusCode(zUniqueKeyViolationError),
      },
    },
  },
  {
    pathPrefix: "/auth",
  },
);

export { auth2Contract };
