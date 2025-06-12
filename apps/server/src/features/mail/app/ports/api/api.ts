import type { Send } from "./ios";

abstract class Api {
  abstract send(params: Send.In): Promise<boolean>;
}

export { Api };
