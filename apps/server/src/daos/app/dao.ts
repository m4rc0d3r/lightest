import type { Session, FieldName as SessionFieldName } from "../../dtos/app/session.js";
import type { Test } from "../../dtos/app/test/base";
import type { BriefPassedTest, BriefTest } from "../../dtos/app/test/brief";
import type { User, FieldName as UserFieldName } from "../../dtos/app/user.js";

type DAO = {
  init(): Promise<void>;

  createUser(
    email: User["email"],
    password: User["password"],
    activationLink: User["activationLink"],
  ): Promise<User["id"]>;
  getUserBy<T extends UserFieldName>(fieldName: T, value: User[T]): Promise<User | undefined>;
  activateUser(id: User["id"]): Promise<void>;
  getUsers(): Promise<User[]>;

  createSession(
    userId: User["id"],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<Session["id"]>;
  getSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
  ): Promise<Session | undefined>;
  updateSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<void>;
  destroySessionBy<T extends SessionFieldName>(fieldName: T, value: Session[T]): Promise<void>;

  createTest(authorId: User["id"], test: Test): Promise<Test["id"]>;
  getTestToEdit(testId: Test["id"]): Promise<Test | undefined>;
  updateTest(test: Test): Promise<void>;
  getTestAuthor(testId: Test["id"]): Promise<User | undefined>;
  getBriefTests(): Promise<BriefTest[]>;
  getBriefTestsCreatedByUser(authorId: User["id"]): Promise<BriefTest[]>;
  getBriefTestsPassedByUser(passingId: User["id"]): Promise<BriefPassedTest[]>;
  getTestToPass(id: Test["id"]): Promise<Test | undefined>;
  createPassedTest(passingId: User["id"], test: Test): Promise<Test["id"]>;
  getPassedTest(id: Test["id"]): Promise<Test | undefined>;
};

export type { DAO };
