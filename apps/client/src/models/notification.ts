import * as uuid from "uuid";

export class Notification {
  readonly id: string;
  readonly status: Status;
  readonly message: string;

  constructor(status: Status, message: string) {
    this.id = uuid.v4();
    this.status = status;
    this.message = message;
  }
}

export enum Status {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
