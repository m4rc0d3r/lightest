export const TEST_MODE = {
  EDITABLE: "EDITABLE",
  PASSABLE: "PASSABLE",
  PASSED: "PASSED",
} as const;
export type TestMode = (typeof TEST_MODE)[keyof typeof TEST_MODE];
