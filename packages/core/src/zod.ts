import { z } from "zod";

const zTrimmedStr = z.string().trim();
const zInt = z.number().int();
const zEmail = z.string().email();
const zUrlOrEmptyStr = z.union([z.string().url(), z.string().length(0)]);

export { zEmail, zInt, zTrimmedStr, zUrlOrEmptyStr };
