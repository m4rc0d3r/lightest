import type { Test } from "../dtos/app/test/base";
import type { User } from "../dtos/app/user.js";

import type { DAO } from "~/daos/app/dao.js";

class UserService {
  constructor(private readonly dao: DAO) {}

  async getUsers(): Promise<User[]> {
    return await this.dao.getUsers();
  }

  async getTestAuthor(test_id: Test["id"]): Promise<User | undefined> {
    return await this.dao.getTestAuthor(test_id);
  }
}

export { UserService };
