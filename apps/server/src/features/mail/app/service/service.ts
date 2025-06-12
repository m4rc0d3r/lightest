import type { Api, ApiIos } from "../ports";

class Service {
  constructor(private readonly api: Api) {}

  send(params: ApiIos.Send.In): Promise<boolean> {
    return this.api.send(params);
  }
}

export { Service };
