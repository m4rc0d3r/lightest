import { ContractNoBody, initContract } from "@ts-rest/core";

import { getFailedResponses, zNotFoundError } from "../error";
import { defineMetadata, requiresAuthentication } from "../metadata";

import { GetMe } from "./ios";

const c = initContract();
const contract = c.router(
  {
    getMe: {
      method: "GET",
      path: "/get-me",
      responses: {
        200: GetMe.zResBody200,
        401: ContractNoBody,
        ...getFailedResponses([zNotFoundError]),
      },
      metadata: defineMetadata(requiresAuthentication()),
    },
  },
  {
    pathPrefix: "/user",
  },
);

export { contract };
