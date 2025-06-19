import type { defineConfig } from "eslint/config";

type Config = Parameters<typeof defineConfig>[0];

export type { Config };
