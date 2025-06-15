import { Zod } from "@lightest/core";
import { z } from "zod";

const { zTrimmedStr } = Zod;

const zAppConfig = z

  .object({
    APP_NAME: zTrimmedStr.nonempty(),
  })
  .transform(({ APP_NAME }) => ({
    name: APP_NAME,
  }));
type AppConfig = z.infer<typeof zAppConfig>;

export { zAppConfig };
export type { AppConfig };
