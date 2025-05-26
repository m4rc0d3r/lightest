export enum Code {
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
}

export class APIError extends Error {
  status: number;
  code: Code;

  private constructor(message: string, status: number, code: Code) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
  }

  static BadRequest(message = "Invalid request", code = Code.BAD_REQUEST): APIError {
    return new APIError(message, 400, code);
  }

  static Unauthorized(message = "User not authenticated.", code = Code.UNAUTHORIZED): APIError {
    return new APIError(message, 401, code);
  }

  static Forbidden(message = "User not authorized.", code = Code.FORBIDDEN): APIError {
    return new APIError(message, 403, code);
  }

  static InternalServerError(message = "Internal server error.", code = Code.GENERAL): APIError {
    return new APIError(message, 500, code);
  }

  toJSON(): Pick<APIError, "message" | "code"> {
    return { message: this.message, code: this.code };
  }
}
