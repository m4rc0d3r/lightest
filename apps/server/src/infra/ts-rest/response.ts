import type { HTTPStatusCode } from "@ts-rest/core";

function noBody<T extends HTTPStatusCode>(status: T) {
  return { status, body: undefined };
}

function unexpectedError() {
  return {
    status: 500,
    body: {
      area: "UNEXPECTED",
      message: "Something went wrong.",
    },
  } as const;
}

export { noBody, unexpectedError };
