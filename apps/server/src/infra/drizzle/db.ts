import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { zDrizzleConfig } from "../config/drizzle";

const { databaseUrl, casing } = zDrizzleConfig.parse(process.env);

const db = drizzle({
  connection: databaseUrl,
  casing,
});

export { db };
