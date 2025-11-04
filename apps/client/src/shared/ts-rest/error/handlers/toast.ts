import { EMPTY, PERIOD } from "@lightest/core";
import type { AppRoute } from "@ts-rest/core";

import { handleError } from "./base";

function handleErrorWithToast<T extends AppRoute, U extends Capitalize<string>>(
  response: unknown,
  contractEndpoint: T,
  onExpectedError: Parameters<typeof handleError<T, U>>[2]["onExpectedError"],
) {
  return [
    handleError(response, contractEndpoint, {
      onFetchError: () => {
        return "Failed to send request, possibly a connection problem";
      },
      onUnknownErrorResponse: () => {
        return AN_UNEXPECTED_SITUATION_HAS_OCCURRED_PLEASE_TRY_AGAIN;
      },
      onStatus500: () => {
        return AN_UNEXPECTED_SITUATION_HAS_OCCURRED_PLEASE_TRY_AGAIN;
      },
      onExpectedError,
    }),
    PERIOD,
  ].join(EMPTY);
}

const AN_UNEXPECTED_SITUATION_HAS_OCCURRED_PLEASE_TRY_AGAIN =
  "an unexpected situation has occurred, please try again";

export { handleErrorWithToast };
