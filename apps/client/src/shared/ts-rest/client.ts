import { Contract } from "@lightest/core";
import type { ClientArgs } from "@ts-rest/core";

import { initQueryClient } from "./tanstack-query";

type Options = {
  baseUrl: string;
};

function createTsRestClient({
  baseUrl,
}: Options): ReturnType<typeof initQueryClient<typeof Contract.contract, ClientArgs>> {
  const clientArgs: ClientArgs = {
    baseUrl,
    credentials: "include",
  };

  return initQueryClient(Contract.contract, clientArgs);
}

export { createTsRestClient };
