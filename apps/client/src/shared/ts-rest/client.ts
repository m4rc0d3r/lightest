import { Contract } from "@lightest/core";

import { initQueryClient } from "./tanstack-query";

type Options = {
  baseUrl: string;
};

function createTsRestClient({ baseUrl }: Options) {
  return initQueryClient(Contract.contract, {
    baseUrl,
    credentials: "include",
  });
}

export { createTsRestClient };
