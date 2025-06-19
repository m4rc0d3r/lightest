import type { ConfigWithExtends } from "typescript-eslint";

import { config as importConfig } from "./import";
import { config as javascriptConfig } from "./javascript";
import { config as nodeConfig } from "./node";
import { config as prettierConfig } from "./prettier";
import { ordinary as typescriptConfig } from "./typescript";

function config(tsconfigRootDir: string) {
  return [
    javascriptConfig,
    nodeConfig,
    typescriptConfig(tsconfigRootDir),
    importConfig,
    prettierConfig,
  ] as ConfigWithExtends[];
}

export { config };
