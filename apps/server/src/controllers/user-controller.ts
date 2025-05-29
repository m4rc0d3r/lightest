import type { NextFunction, Request, Response } from "express";

import type { User } from "../dtos/app/user.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";

class UserController {
  async getUsers(
    req: Request<ParamsDictionary, User[], unknown, ParsedQs, Record<string, unknown>>,
    res: Response<User[], Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const { userService } = req.container.cradle;

    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

const userController = new UserController();

export { userController };
