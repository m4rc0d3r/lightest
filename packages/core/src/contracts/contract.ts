import { initContract } from "@ts-rest/core";

import { contract as authContract } from "./auth";
import { zUnexpectedError } from "./error";
import { contract as userContract } from "./user";

const c = initContract();
const contract = c.router(
  {
    auth: authContract,
    user: userContract,
  },
  {
    strictStatusCodes: true,
    commonResponses: {
      500: zUnexpectedError,
    },
  },
);

export { contract };
