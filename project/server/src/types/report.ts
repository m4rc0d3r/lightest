// import { APIError } from "../exceptions/api-error";

// export interface SuccessfulResponse<T = undefined> {
//     message: string;
//     payload?: T;
// }

// export type BadResponse = Pick<APIError, "message" | "code">;

export class Report<T = undefined> {
  message: string;
  payload?: T;

  constructor(message: string, payload?: T) {
    this.message = message;
    this.payload = payload;
  }
}
