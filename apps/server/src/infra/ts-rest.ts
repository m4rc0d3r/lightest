import { initServer } from "@ts-rest/express";

const tsRestServer: ReturnType<typeof initServer> = initServer();

export { tsRestServer };
