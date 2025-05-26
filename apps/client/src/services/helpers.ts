import { type AxiosResponse, AxiosError } from "axios";

import { Report } from "@/http/dtos/report";
import { APIError, APIErrorCode } from "@/http/dtos/api-error";

export function handleError(e: unknown): AxiosError<APIError, any> {
  if (e instanceof AxiosError) {
    return e as AxiosError<APIError>;
  } else {
    throw e;
  }
}

export function extractData<T = undefined>(
  result: AxiosResponse<Report<T>, any> | AxiosError<APIError, any>
): Report<T> | APIError {
  if (result instanceof AxiosError) {
    if (result.code === APIErrorCode.ERR_NETWORK) {
      return new APIError(
        "Failed to connect to the server. Check your Internet connection.",
        result.code
      );
    } else {
      return new APIError(
        (result.response as AxiosResponse<APIError>).data.message,
        (result.response as AxiosResponse<APIError>).data.code
      );
    }
  } else {
    return new Report(
      (result as AxiosResponse<Report<T>>).data.message,
      (result as AxiosResponse<Report<T>>).data.payload
    );
  }
}
