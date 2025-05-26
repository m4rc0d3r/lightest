import { NextFunction, Request, Response } from "express";
import { User } from "../dtos/app/user.js";
import { userService } from "../services/user-service.js";
import { ParamsDictionary, ParsedQs } from "../types/express.js";

class UserController {
  async getUsers(
    req: Request<ParamsDictionary, User[], unknown, ParsedQs, Record<string, unknown>>,
    res: Response<User[], Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await userService.getUsers();
      res.json(users);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
