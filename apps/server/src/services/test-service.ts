import { dao } from "../daos/sqlite/dao.js";
import type { Test } from "../dtos/app/test/base";
import type { BriefPassedTest, BriefTest } from "../dtos/app/test/brief";
import type { User } from "../dtos/app/user.js";
import { APIError } from "../exceptions/api-error.js";

class TestService {
  async create(authorId: User["id"], test: Test): Promise<void> {
    await dao.createTest(authorId, test);
  }

  async getTestToEdit(id: Test["id"]): Promise<Test> {
    const test = await dao.getTestToEdit(id);

    if (test === undefined) {
      throw APIError.BadRequest("Test not found.");
    }

    return test;
  }

  async update(test: Test): Promise<Test> {
    await dao.updateTest(test);

    const updatedTest = await dao.getTestToEdit(test.id);

    if (updatedTest === undefined) {
      throw APIError.BadRequest("Updated test not found.");
    }

    return updatedTest;
  }

  async getBriefTests(): Promise<BriefTest[]> {
    return await dao.getBriefTests();
  }

  async getBriefTestsCreatedByUser(authorId: User["id"]): Promise<BriefTest[]> {
    return await dao.getBriefTestsCreatedByUser(authorId);
  }

  async getBriefTestsPassedByUser(passingId: User["id"]): Promise<BriefPassedTest[]> {
    return await dao.getBriefTestsPassedByUser(passingId);
  }

  async getTestToPass(id: Test["id"]): Promise<Test> {
    const test = await dao.getTestToPass(id);

    if (test === undefined) {
      throw APIError.BadRequest("Test not found.");
    }

    return test;
  }

  async createPassedTest(passingId: User["id"], test: Test): Promise<Test["id"]> {
    const id = await dao.createPassedTest(passingId, test);

    return id;
  }

  async getPassedTest(id: Test["id"]): Promise<Test> {
    const test = await dao.getPassedTest(id);

    if (test === undefined) {
      throw APIError.BadRequest("Passed test not found.");
    }

    return test;
  }
}

const testService = new TestService();

export { testService };
