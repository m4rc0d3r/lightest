CREATE TYPE "public"."question_type" AS ENUM(
  'EXTENDED',
  'WITH_ONE_CORRECT_ANSWER_OPTION',
  'WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS'
);

--> statement-breakpoint
CREATE TABLE "answer_option" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "answer_option_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "question_id" INTEGER,
  "content" TEXT NOT NULL,
  "is_correct" BOOLEAN NOT NULL
);

--> statement-breakpoint
CREATE TABLE "correct_extended_answer" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "correct_extended_answer_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "question_id" INTEGER,
  "content" TEXT NOT NULL
);

--> statement-breakpoint
CREATE TABLE "passed_answer_option" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "passed_answer_option_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "passed_question_id" INTEGER NOT NULL,
  "answer_option_id" INTEGER NOT NULL,
  "is_chosen" BOOLEAN NOT NULL
);

--> statement-breakpoint
CREATE TABLE "passed_extended_answer" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "passed_extended_answer_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "passed_question_id" INTEGER NOT NULL,
  "correct_answer_id" INTEGER NOT NULL,
  "content" TEXT NOT NULL
);

--> statement-breakpoint
CREATE TABLE "passed_question" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "passed_question_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "passed_test_id" INTEGER NOT NULL,
  "question_id" INTEGER NOT NULL
);

--> statement-breakpoint
CREATE TABLE "passed_test" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "passed_test_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "test_id" INTEGER NOT NULL,
  "passing_id" INTEGER NOT NULL
);

--> statement-breakpoint
CREATE TABLE "question" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "question_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "test_id" INTEGER,
  "type" "question_type" NOT NULL,
  "content" TEXT NOT NULL,
  "worth" DOUBLE PRECISION NOT NULL
);

--> statement-breakpoint
CREATE TABLE "session" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "session_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "user_id" INTEGER NOT NULL,
  "refresh_token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  CONSTRAINT "session_refresh_token_unique" UNIQUE ("refresh_token")
);

--> statement-breakpoint
CREATE TABLE "test" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "test_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "author_id" INTEGER NOT NULL,
  "title" TEXT NOT NULL
);

--> statement-breakpoint
CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "user_id_seq" increment by 1 minvalue 1 maxvalue 2147483647 start
    WITH
      1 cache 1
  ),
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "activation_link" TEXT NOT NULL,
  "is_activated" BOOLEAN DEFAULT FALSE NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE ("email"),
  CONSTRAINT "user_activation_link_unique" UNIQUE ("activation_link")
);

--> statement-breakpoint
ALTER TABLE "answer_option"
ADD CONSTRAINT "answer_option_question_id_question_id_fk" FOREIGN key ("question_id") REFERENCES "public"."question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "correct_extended_answer"
ADD CONSTRAINT "correct_extended_answer_question_id_question_id_fk" FOREIGN key ("question_id") REFERENCES "public"."question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_answer_option"
ADD CONSTRAINT "passed_answer_option_passed_question_id_passed_question_id_fk" FOREIGN key ("passed_question_id") REFERENCES "public"."passed_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_answer_option"
ADD CONSTRAINT "passed_answer_option_answer_option_id_answer_option_id_fk" FOREIGN key ("answer_option_id") REFERENCES "public"."answer_option" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_extended_answer"
ADD CONSTRAINT "passed_extended_answer_passed_question_id_passed_question_id_fk" FOREIGN key ("passed_question_id") REFERENCES "public"."passed_question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_extended_answer"
ADD CONSTRAINT "passed_extended_answer_correct_answer_id_correct_extended_answer_id_fk" FOREIGN key ("correct_answer_id") REFERENCES "public"."correct_extended_answer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_question"
ADD CONSTRAINT "passed_question_passed_test_id_passed_test_id_fk" FOREIGN key ("passed_test_id") REFERENCES "public"."passed_test" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_question"
ADD CONSTRAINT "passed_question_question_id_question_id_fk" FOREIGN key ("question_id") REFERENCES "public"."question" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_test"
ADD CONSTRAINT "passed_test_test_id_test_id_fk" FOREIGN key ("test_id") REFERENCES "public"."test" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "passed_test"
ADD CONSTRAINT "passed_test_passing_id_user_id_fk" FOREIGN key ("passing_id") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "question"
ADD CONSTRAINT "question_test_id_test_id_fk" FOREIGN key ("test_id") REFERENCES "public"."test" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "session"
ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN key ("user_id") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "test"
ADD CONSTRAINT "test_author_id_user_id_fk" FOREIGN key ("author_id") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
