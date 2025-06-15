import { initContract } from "@ts-rest/core";

import { contract as authContract } from "./auth";
import { zUnexpectedError } from "./error";

const c = initContract();
const contract = c.router(
  {
    auth: authContract,
  },
  {
    strictStatusCodes: true,
    commonResponses: {
      500: zUnexpectedError,
    },
  },
);

export { contract };
