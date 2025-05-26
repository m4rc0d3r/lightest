export enum APIErrorCode {
  GENERAL = "GENERAL",
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  EMAIL_IS_BUSY = "EMAIL_IS_BUSY",
  EMAIL_NOT_FOUND = "EMAIL_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  ACTIVATION_LINK_IS_INVALID = "ACTIVATION_LINK_IS_INVALID",
  INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
  DATA_CANNOT_BE_PARSED = "DATA_CANNOT_BE_PARSED",
  ERR_NETWORK = "ERR_NETWORK",
}

export class APIError extends Error {
  code: APIErrorCode;

  constructor(message: string, code: APIErrorCode) {
    super(message);
    this.name = "ErrorFromServer";
    this.code = code;
  }
}
