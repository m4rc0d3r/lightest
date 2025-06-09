import { zTrimmedStr } from "~/zod";

const zPasswordHash = zTrimmedStr.nonempty();

export { zPasswordHash };
