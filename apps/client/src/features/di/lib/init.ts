import { Http } from "@lightest/core";

import type { DiContainer } from "../model";

import type { Config } from "@/shared/config";
import { createTsRestClient } from "@/shared/ts-rest";

type Params = {
  config: Config;
};

function initDiContainer({ config }: Params): DiContainer {
  const {
    serverApp: { protocol, address, port },
  } = config;

  return {
    tsRestClient: createTsRestClient({
      baseUrl: Http.Url.create({
        protocol,
        address,
        port,
      }),
    }),
  };
}

export { initDiContainer };
