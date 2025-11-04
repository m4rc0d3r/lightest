import { createUrl } from "@lightest/core";

import type { DiContainer } from "../model";

import type { Config } from "@/shared/config";
import { createTsRestClient } from "@/shared/ts-rest";

type Params = {
  config: Config;
} & Pick<
  Parameters<typeof createTsRestClient>[0],
  "getAccessToken" | "refreshAuthentication" | "onUnauthorized"
>;

function initDiContainer({ config, ...rest }: Params): DiContainer {
  const {
    serverApp: { protocol, address, port },
  } = config;

  return {
    tsRestClient: createTsRestClient({
      baseUrl: createUrl({
        protocol,
        address,
        port,
      }),
      ...rest,
    }),
  };
}

export { initDiContainer };
