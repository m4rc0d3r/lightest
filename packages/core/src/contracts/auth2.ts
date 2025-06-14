import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  getErrorWithHttpStatusCode,
  zNotFoundError,
  zUniqueKeyViolationError,
} from "./error-schemas";

import { zAvatarAsFile, zUser } from "~/domain";

const zRegisterReq = zUser
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  })
  .extend({
    avatar: z.union([zUser.shape.avatar, zAvatarAsFile]),
  });

const zMe = zUser.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  verificationCode: true,
  createdAt: true,
});

const zRegisterSuccessfulRes = z.object({
  accessToken: z.string().jwt(),
  me: zMe,
});

const zLoginReq = zUser.pick({
  email: true,
  password: true,
});

const zLoginSuccessfulRes = zRegisterSuccessfulRes;

const c = initContract();
const auth2Contract = c.router(
  {
    register: {
      method: "POST",
      path: "/register",
      contentType: "multipart/form-data",
      body: zRegisterReq,
      responses: {
        201: zRegisterSuccessfulRes,
        ...getErrorWithHttpStatusCode(zUniqueKeyViolationError),
      },
    },
    login: {
      method: "POST",
      path: "/login",
      body: zLoginReq,
      responses: {
        200: zLoginSuccessfulRes,
        ...getErrorWithHttpStatusCode(zNotFoundError),
      },
    },
  },
  {
    pathPrefix: "/auth",
  },
);

export { auth2Contract };
