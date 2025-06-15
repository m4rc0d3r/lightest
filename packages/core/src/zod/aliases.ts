import { z } from "zod";

const zUrlOrEmptyStr = z.union([z.string().url(), z.string().length(0)]);

export { zUrlOrEmptyStr };
