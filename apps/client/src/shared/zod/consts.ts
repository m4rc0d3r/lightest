import { z } from "zod";

const DEFAULT_ZOD_PARSE_PARAMS: z.ParseParams = {
  path: z.EMPTY_PATH,
  errorMap: (_issue, ctx) => ({
    message: ctx.defaultError,
  }),
  async: false,
};

export { DEFAULT_ZOD_PARSE_PARAMS };
