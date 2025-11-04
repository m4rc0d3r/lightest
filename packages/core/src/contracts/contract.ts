import { initContract } from "@ts-rest/core";

import { authContract } from "./auth";
import { testContract } from "./test";

const c = initContract();
const contract = c.router(
  {
    auth: authContract,
    test: testContract,
  },
  {
    pathPrefix: "/api",
    strictStatusCodes: true,
  },
);

export { contract };
