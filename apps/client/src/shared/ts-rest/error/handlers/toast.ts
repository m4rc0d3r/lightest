import { Str } from "@lightest/core";
import type { AppRoute } from "@ts-rest/core";
import type { useI18n, UseI18nOptions } from "vue-i18n";

import { handleError } from "./base";

import { Tk } from "@/shared/i18n";

function handleErrorWithToast<
  T extends AppRoute,
  U extends Capitalize<string>,
  Options extends UseI18nOptions = UseI18nOptions,
>(
  response: unknown,
  contractEndpoint: T,
  onExpectedError: Parameters<typeof handleError<T, U>>[2]["onExpectedError"],
  t: ReturnType<typeof useI18n<Options>>["t"],
) {
  return [
    handleError(response, contractEndpoint, {
      onFetchError: () => {
        return Str.capitalize(t(Tk.failed_to_send_request_possibly_a_connection_problem));
      },
      onUnknownErrorResponse: () => {
        return Str.capitalize(t(Tk.an_unexpected_situation_has_occurred_please_try_again));
      },
      onStatus500: () => {
        return Str.capitalize(t(Tk.an_unexpected_situation_has_occurred_please_try_again));
      },
      onExpectedError,
    }),
    Str.PERIOD,
  ].join(Str.EMPTY);
}

export { handleErrorWithToast };
