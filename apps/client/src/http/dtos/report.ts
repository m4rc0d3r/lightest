export class Report<T = undefined> {
  message: string;
  payload?: T;

  constructor(message: string, payload?: T) {
    this.message = message;
    this.payload = payload;
  }
}
