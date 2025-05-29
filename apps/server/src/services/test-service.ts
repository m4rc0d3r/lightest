import type { Test } from "../dtos/app/test/base";
import type { BriefPassedTest, BriefTest } from "../dtos/app/test/brief";
import type { User } from "../dtos/app/user.js";
import { APIError } from "../exceptions/api-error.js";

import type { DAO } from "~/daos/app/dao";

class TestService {
  constructor(private readonly dao: DAO) {}

  async create(authorId: User["id"], test: Test): Promise<void> {
    await this.dao.createTest(authorId, test);
  }

  async getTestToEdit(id: Test["id"]): Promise<Test> {
    const test = await this.dao.getTestToEdit(id);

    if (test === undefined) {
      throw APIError.BadRequest("Test not found.");
    }

    return test;
  }

  async update(test: Test): Promise<Test> {
    await this.dao.updateTest(test);

    const updatedTest = await this.dao.getTestToEdit(test.id);

    if (updatedTest === undefined) {
      throw APIError.BadRequest("Updated test not found.");
    }

    return updatedTest;
  }

  async getBriefTests(): Promise<BriefTest[]> {
    return await this.dao.getBriefTests();
  }

  async getBriefTestsCreatedByUser(authorId: User["id"]): Promise<BriefTest[]> {
    return await this.dao.getBriefTestsCreatedByUser(authorId);
  }

  async getBriefTestsPassedByUser(passingId: User["id"]): Promise<BriefPassedTest[]> {
    return await this.dao.getBriefTestsPassedByUser(passingId);
  }

  async getTestToPass(id: Test["id"]): Promise<Test> {
    const test = await this.dao.getTestToPass(id);

    if (test === undefined) {
      throw APIError.BadRequest("Test not found.");
    }

    return test;
  }

  async createPassedTest(passingId: User["id"], test: Test): Promise<Test["id"]> {
    const id = await this.dao.createPassedTest(passingId, test);

    return id;
  }

  async getPassedTest(id: Test["id"]): Promise<Test> {
    const test = await this.dao.getPassedTest(id);

    if (test === undefined) {
      throw APIError.BadRequest("Passed test not found.");
    }

    return test;
  }
}

export { TestService };
