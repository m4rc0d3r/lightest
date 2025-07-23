import { Contract } from "@lightest/core";
import { initClient } from "@ts-rest/core";

type Options = {
  baseUrl: string;
};

function createTsRestClient({ baseUrl }: Options) {
  return initClient(Contract.contract, {
    baseUrl,
  });
}

export { createTsRestClient };
