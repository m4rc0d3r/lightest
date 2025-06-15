import { Zod } from "~/zod";

const { zTrimmedStr } = Zod;

const zPasswordHash = zTrimmedStr.nonempty();

export { zPasswordHash };
