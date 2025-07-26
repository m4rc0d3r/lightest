import type {
  AppRoute,
  ClientInferResponses,
  ErrorHttpStatusCode,
  InferResponseUndefinedStatusCodes,
} from "@ts-rest/core";
import { isErrorResponse, isUnknownErrorResponse } from "@ts-rest/core";

import type { FetchError } from "../type-guards";
import { isFetchError } from "../type-guards";

type Handlers<T extends AppRoute, U> = {
  onFetchError: (error: FetchError) => U;
  onUnknownErrorResponse: (
    response: ClientInferResponses<
      T,
      InferResponseUndefinedStatusCodes<T, ErrorHttpStatusCode>,
      "ignore"
    >,
  ) => U;
  onStatus500: (response: ClientInferResponses<T, 500>) => U;
  onExpectedError: (
    response: ClientInferResponses<
      T,
      Exclude<Extract<ErrorHttpStatusCode, keyof T["responses"]>, 500>
    >,
  ) => U;
};

function handleError<T extends AppRoute, U>(
  response: unknown,
  contractEndpoint: T,
  { onFetchError, onUnknownErrorResponse, onStatus500, onExpectedError }: Handlers<T, U>,
) {
  if (isFetchError(response)) {
    return onFetchError(response);
  } else if (isUnknownErrorResponse(response, contractEndpoint)) {
    return onUnknownErrorResponse(response);
  } else if (isErrorResponse(response)) {
    if (response.status === 500) {
      return onStatus500(response as Parameters<typeof onStatus500>[0]);
    } else {
      return onExpectedError(response as Parameters<typeof onExpectedError>[0]);
    }
  }
  throw new Error();
}

export { handleError };
