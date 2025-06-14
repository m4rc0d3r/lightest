import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const CONSTRAINT = {
  userEmail: "users_email_unique",
  userVerificationCode: "users_verification_code_unique",
} as const;

const users = pgTable("users", {
  id: serial().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatar: text().notNull(),
  email: text().notNull().unique(CONSTRAINT.userEmail),
  passwordHash: text("password_hash").notNull(),
  verificationCode: text("verification_code").unique(CONSTRAINT.userVerificationCode),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const TABLE = {
  users,
} as const;

export { CONSTRAINT, TABLE, users };
