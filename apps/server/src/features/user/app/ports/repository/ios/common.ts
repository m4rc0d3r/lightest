import { zUser } from "@lightest/core";
import type z from "zod";

const zOut = zUser.omit({
  password: true,
});
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
