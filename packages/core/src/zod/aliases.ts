import { z } from "zod";

const zUrlOrEmptyStr = z.union([z.string().url(), z.string().length(0)]);

const zNumberOfAttempts = z.union([z.number().int().nonnegative(), z.literal("UNLIMITED")]);

export { zNumberOfAttempts, zUrlOrEmptyStr };
