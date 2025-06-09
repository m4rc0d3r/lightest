import { zTrimmedStr } from "~/zod";

const zPassword = zTrimmedStr.nonempty();

export { zPassword };
