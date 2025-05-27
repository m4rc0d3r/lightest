import { dao } from "../daos/sqlite/dao.js";
import type { Test } from "../dtos/app/test/base";
import type { User } from "../dtos/app/user.js";

class UserService {
  async getUsers(): Promise<User[]> {
    return await dao.getUsers();
  }

  async getTestAuthor(test_id: Test["id"]): Promise<User | undefined> {
    return await dao.getTestAuthor(test_id);
  }
}

const userService = new UserService();

export { userService };
