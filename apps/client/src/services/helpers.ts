import type { AxiosResponse } from "axios";
import { AxiosError } from "axios";

import { APIError, API_ERROR_CODE } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";

function handleError(e: unknown): AxiosError<APIError, unknown> {
  if (e instanceof AxiosError) {
    return e as AxiosError<APIError>;
  } else {
    throw e;
  }
}

function extractData<T = undefined>(
  result: AxiosResponse<Report<T>, unknown> | AxiosError<APIError, unknown>,
): Report<T> | APIError {
  if (result instanceof AxiosError) {
    if (result.code === API_ERROR_CODE.ERR_NETWORK) {
      return new APIError(
        "Failed to connect to the server. Check your Internet connection.",
        result.code,
      );
    } else {
      return new APIError(result.response!.data.message, result.response!.data.code);
    }
  } else {
    return new Report(result.data.message, result.data.payload);
  }
}

export { extractData, handleError };
