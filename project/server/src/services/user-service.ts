import { dao } from "../daos/sqlite/dao.js";
import { User } from "../dtos/app/user.js";
import { Test } from "../dtos/app/test/base/index.js";

class UserService {
  async getUsers(): Promise<User[]> {
    return await dao.getUsers();
  }

  async getTestAuthor(test_id: Test["id"]): Promise<User | undefined> {
    return await dao.getTestAuthor(test_id);
  }
}

export const userService = new UserService();
