import * as uuid from "uuid";

class Notification {
  readonly id: string;
  readonly status: Status;
  readonly message: string;

  constructor(status: Status, message: string) {
    this.id = uuid.v4();
    this.status = status;
    this.message = message;
  }
}

const STATUS = {
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
} as const;
type Status = (typeof STATUS)[keyof typeof STATUS];

export { Notification, STATUS };
export type { Status };
