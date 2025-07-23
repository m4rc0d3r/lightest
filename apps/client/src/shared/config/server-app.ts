import { z } from "zod";

const zServerAppConfig = z
  .object({
    VITE_SERVER_APP_PROTOCOL: z.string().nonempty(),
    VITE_SERVER_APP_ADDRESS: z.string().nonempty(),
    VITE_SERVER_APP_PORT: z.coerce.number().positive(),
  })
  .transform(({ VITE_SERVER_APP_PROTOCOL, VITE_SERVER_APP_ADDRESS, VITE_SERVER_APP_PORT }) => ({
    protocol: VITE_SERVER_APP_PROTOCOL,
    address: VITE_SERVER_APP_ADDRESS,
    port: VITE_SERVER_APP_PORT,
  }));
type ServerAppConfig = z.infer<typeof zServerAppConfig>;

export { zServerAppConfig };
export type { ServerAppConfig };
