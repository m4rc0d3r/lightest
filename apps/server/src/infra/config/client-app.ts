import { z } from "zod";

const zClientAppConfig = z
  .object({
    CLIENT_APP_PROTOCOL: z.string().nonempty(),
    CLIENT_APP_ADDRESS: z.string().nonempty(),
    CLIENT_APP_PORT: z.preprocess((value) => {
      if (typeof value === "number") return value;

      if (typeof value === "string") return value.length > 0 ? Number(value) : undefined;

      return value;
    }, z.number().positive().optional()),
  })
  .transform(({ CLIENT_APP_PROTOCOL, CLIENT_APP_ADDRESS, CLIENT_APP_PORT }) => ({
    protocol: CLIENT_APP_PROTOCOL,
    address: CLIENT_APP_ADDRESS,
    port: CLIENT_APP_PORT,
  }));
type ClientAppConfig = z.infer<typeof zClientAppConfig>;

export { zClientAppConfig };
export type { ClientAppConfig };
