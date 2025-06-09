import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const TABLE_NAME = {
  user: "user",
  session: "session",
  test: "test",
  question: "question",
  correctExtendedAnswer: "correct_extended_answer",
  answerOption: "answer_option",
  passedTest: "passed_test",
  passedQuestion: "passed_question",
  passedExtendedAnswer: "passed_extended_answer",
  passedAnswerOption: "passed_answer_option",
} as const;

const userTable = pgTable(TABLE_NAME.user, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),
  password: text().notNull(),
  activationLink: text("activation_link").notNull().unique(),
  isActivated: boolean("is_activated").notNull().default(false),
});

const sessionTable = pgTable(TABLE_NAME.session, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  refreshToken: text("refresh_token").notNull().unique(),
  expires: timestamp().notNull(),
});

const testTable = pgTable(TABLE_NAME.test, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer("author_id")
    .notNull()
    .references(() => userTable.id),
  title: text().notNull(),
});

const questionTypeEnum = pgEnum("question_type", [
  "EXTENDED",
  "WITH_ONE_CORRECT_ANSWER_OPTION",
  "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
]);

const questionTable = pgTable(TABLE_NAME.question, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  testId: integer("test_id").references(() => testTable.id),
  type: questionTypeEnum().notNull(),
  content: text().notNull(),
  worth: doublePrecision().notNull(),
});

const correctExtendedAnswerTable = pgTable(TABLE_NAME.correctExtendedAnswer, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id").references(() => questionTable.id),
  content: text().notNull(),
});

const answerOptionTable = pgTable(TABLE_NAME.answerOption, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id").references(() => questionTable.id),
  content: text().notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

const passedTestTable = pgTable(TABLE_NAME.passedTest, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  testId: integer("test_id")
    .notNull()
    .references(() => testTable.id),
  passingId: integer("passing_id")
    .notNull()
    .references(() => userTable.id),
});

const passedQuestionTable = pgTable(TABLE_NAME.passedQuestion, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passedTestId: integer("passed_test_id")
    .notNull()
    .references(() => passedTestTable.id),
  questionId: integer("question_id")
    .notNull()
    .references(() => questionTable.id),
});

const passedExtendedAnswerTable = pgTable(TABLE_NAME.passedExtendedAnswer, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passedQuestionId: integer("passed_question_id")
    .notNull()
    .references(() => passedQuestionTable.id),
  correctAnswerId: integer("correct_answer_id")
    .notNull()
    .references(() => correctExtendedAnswerTable.id),
  content: text().notNull(),
});

const passedAnswerOptionTable = pgTable(TABLE_NAME.passedAnswerOption, {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  passedQuestionId: integer("passed_question_id")
    .notNull()
    .references(() => passedQuestionTable.id),
  answerOptionId: integer("answer_option_id")
    .notNull()
    .references(() => answerOptionTable.id),
  isChosen: boolean("is_chosen").notNull(),
});

const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  tests: many(testTable),
  passedTests: many(passedTestTable),
}));

const testRelations = relations(testTable, ({ many }) => ({
  questions: many(questionTable),
  passedTests: many(passedTestTable),
}));

const questionRelations = relations(questionTable, ({ many }) => ({
  correctExtendedAnswers: many(correctExtendedAnswerTable),
  answerOptions: many(answerOptionTable),
  passedQuestions: many(passedQuestionTable),
}));

const passedTestRelations = relations(passedTestTable, ({ many }) => ({
  passedQuestions: many(passedQuestionTable),
}));

const passedQuestionRelations = relations(passedQuestionTable, ({ many }) => ({
  passedExtendedAnswers: many(passedExtendedAnswerTable),
  passedAnswerOptions: many(passedAnswerOptionTable),
}));

const correctExtendedAnswerRelations = relations(correctExtendedAnswerTable, ({ many }) => ({
  passedExtendedAnswers: many(passedExtendedAnswerTable),
}));

const answerOptionRelations = relations(answerOptionTable, ({ many }) => ({
  passedAnswerOptions: many(passedAnswerOptionTable),
}));

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

export {
  answerOptionRelations,
  answerOptionTable,
  correctExtendedAnswerRelations,
  correctExtendedAnswerTable,
  passedAnswerOptionTable,
  passedExtendedAnswerTable,
  passedQuestionRelations,
  passedQuestionTable,
  passedTestRelations,
  passedTestTable,
  questionRelations,
  questionTable,
  questionTypeEnum,
  sessionTable,
  TABLE,
  TABLE_NAME,
  testRelations,
  testTable,
  userRelations,CONSTRAINT,
  users,
  userTable,
};
