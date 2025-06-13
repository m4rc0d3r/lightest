import { zTrimmedStr, zUrl } from "@lightest/core";
import { z } from "zod";

const zIn = z.object({
  appName: zTrimmedStr.nonempty(),
  clientAppUrl: zUrl,
  linkToConfirmEmailAddress: zUrl,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
