/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-namespace */

import type { Cradle } from "awilix";

import type { Dependencies } from "./infra/dependencies";

declare global {
  namespace Express {
    interface Request {
      container: {
        cradle: Cradle;
      };
    }
  }
}

declare module "awilix" {
  interface Cradle extends Dependencies {}
}
