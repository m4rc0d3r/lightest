class Report<T = undefined> {
  message: string;
  payload?: T | undefined;

  constructor(message: string, payload?: T) {
    this.message = message;
    this.payload = payload;
  }
}

export { Report };
