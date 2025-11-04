import { contract, SPACE } from "@lightest/core";
import type { ApiFetcherArgs, ClientArgs } from "@ts-rest/core";
import { tsRestFetchApi } from "@ts-rest/core";

import { initQueryClient } from "./tanstack-query";

type Options = {
  baseUrl: string;
  getAccessToken: () => string;
  onUnauthorized: () => void;
  refreshAuthentication: (client: ReturnType<typeof createTsRestClient>) => Promise<boolean>;
};

function createTsRestClient({
  baseUrl,
  getAccessToken,
  refreshAuthentication,
  onUnauthorized,
}: Options): ReturnType<typeof initQueryClient<typeof contract, ClientArgs>> {
  const clientArgs: ClientArgs = {
    baseUrl,
    baseHeaders: {
      [AUTHORIZATION]: () => generateAuthorizationHeaderValue(getAccessToken()),
    },
    credentials: "include",
    api: async (args: ApiFetcherArgs) => {
      const result = await tsRestFetchApi(args);
      if (result.status === 401) {
        const authUpdated = await refreshAuthentication(client);

        if (authUpdated) {
          return tsRestFetchApi({
            ...args,
            headers: {
              ...args.headers,
              [AUTHORIZATION]: generateAuthorizationHeaderValue(getAccessToken()),
            },
          });
        } else {
          onUnauthorized();
        }
      }

      return result;
    },
  };

  const client = initQueryClient(contract, clientArgs);

  return client;
}

const AUTHORIZATION = "authorization";

function generateAuthorizationHeaderValue(token: string) {
  return ["Bearer", token].join(SPACE);
}

export { createTsRestClient };
