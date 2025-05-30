import { either as e } from "fp-ts";
import { z } from "zod";

import { zServerAppConfig } from "./server-app";

const zConfig = z.object({
  serverApp: zServerAppConfig,
});
type Config = z.infer<typeof zConfig>;

function createConfig(
  variables: Record<string, unknown> & { NODE_ENV?: string | undefined },
): e.Either<Error, Config> {
  return e.tryCatch(
    () => {
      return {
        serverApp: zServerAppConfig.parse(variables),
      };
    },
    (error) => {
      if (error instanceof z.ZodError) {
        return new Error(`Failed to create application configuration. Cause: ${error.toString()}`);
      }
      throw error;
    },
  );
}

export { createConfig, zConfig };
export type { Config };
