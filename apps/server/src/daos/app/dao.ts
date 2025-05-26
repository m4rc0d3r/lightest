import { User, FieldName as UserFieldName } from "../../dtos/app/user.js";
import { Session, FieldName as SessionFieldName } from "../../dtos/app/session.js";
import { Test } from "../../dtos/app/test/base/index.js";
import { BriefTest, BriefPassedTest } from "../../dtos/app/test/brief/index.js";

export interface DAO {
  init(): void;

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
}
