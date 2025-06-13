import uid from "uid-safe";

import type { GenerateUidFn } from "../app";

const generateSafeUid: GenerateUidFn = (lengthInBytes) => {
  return uid(lengthInBytes);
};

export { generateSafeUid };
