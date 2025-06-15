import { ContractNoBody, initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  getErrorWithHttpStatusCode,
  zNotFoundError,
  zUniqueKeyViolationError,
} from "./error-schemas";

import { Domain } from "~/domain";

const zRegisterReq = Domain.User.zSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  })
  .extend({
    avatar: z.union([Domain.User.zSchema.shape.avatar, Domain.User.Attribute.Avatar.zFileSchema]),
  });

const zMe = Domain.User.zSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  createdAt: true,
});

const zRegisterSuccessfulRes = z.object({
  me: zMe,
});

const zLoginReq = Domain.User.zSchema.pick({
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
    logout: {
      method: "POST",
      path: "/logout",
      body: ContractNoBody,
      responses: {
        200: ContractNoBody,
        401: ContractNoBody,
      },
    },
  },
  {
    pathPrefix: "/auth",
  },
);

export { auth2Contract };
