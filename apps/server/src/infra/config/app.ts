import { z } from "zod";

const zAppConfig = z

  .object({
    APP_NAME: z.string().trim().nonempty(),
  })
  .transform(({ APP_NAME }) => ({
    name: APP_NAME,
  }));
type AppConfig = z.infer<typeof zAppConfig>;

export { zAppConfig };
export type { AppConfig };
