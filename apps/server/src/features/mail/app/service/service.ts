import { Debug } from "@lightest/core";

import type { Api, ApiIos } from "../ports";

@Debug.ClassDisplayName.set("MailService")
class Service {
  private readonly api: Api;

  constructor(mailApi: Api) {
    this.api = mailApi;
  }

  send(params: ApiIos.Send.In): ReturnType<Api["send"]> {
    return this.api.send(params);
  }
}

export { Service };
