import { ContractNoBody, initContract } from "@ts-rest/core";

import { getFailedResponses, zNotFoundError, zUniqueKeyViolationError } from "../error";

import { Login, Register } from "./ios";

const c = initContract();
const contract = c.router(
  {
    register: {
      method: "POST",
      path: "/register",
      contentType: "multipart/form-data",
      body: Register.zReqBody,
      responses: {
        201: Register.zResBody201,
        ...getFailedResponses([zUniqueKeyViolationError]),
      },
    },
    login: {
      method: "POST",
      path: "/login",
      body: Login.zReqBody,
      responses: {
        200: Login.zResBody200,
        ...getFailedResponses([zNotFoundError]),
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

export { contract };
