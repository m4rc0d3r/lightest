import { Zod } from "@lightest/core";
import { z } from "zod";

const { zTrimmedStr, zUrl } = Zod;

const zIn = z.object({
  appName: zTrimmedStr.nonempty(),
  clientAppUrl: zUrl,
  linkToConfirmEmailAddress: zUrl,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
