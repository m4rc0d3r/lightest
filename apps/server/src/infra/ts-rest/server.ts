import { initServer } from "@ts-rest/express";

const server: ReturnType<typeof initServer> = initServer();

export { server };
