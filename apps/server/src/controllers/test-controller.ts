import type { NextFunction, Request, Response } from "express";

import type { Test } from "../dtos/app/test/base";
import type { BriefPassedTest, BriefTest } from "../dtos/app/test/brief";
import { APIError } from "../exceptions/api-error.js";
import { testService } from "../services/test-service.js";
import { userService } from "../services/user-service.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";
import type { Report } from "../types/report.js";

class TestController {
  async create(
    req: Request<ParamsDictionary, Report, Test, ParsedQs, Record<string, unknown>>,
    res: Response<Report, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const test = req.body;
      await testService.create((req as unknown as { userId: number }).userId, test);
      res.json({ message: "Test created successfully." });
    } catch (e) {
      next(e);
    }
  }

  async getTestToEdit(
    req: Request<ParamsDictionary, Report<Test>, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report<Test>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params["id"]);
      const author = await userService.getTestAuthor(id);

      if (author === undefined || author.id !== (req as unknown as { userId: number }).userId) {
        throw APIError.Forbidden("You do not have permission to edit the requested test.");
      }

      const test = await testService.getTestToEdit(id);
      res.json({ message: "Test successfully found.", payload: test });
    } catch (e) {
      next(e);
    }
  }

  async update(
    req: Request<ParamsDictionary, Report<Test>, Test, ParsedQs, Record<string, unknown>>,
    res: Response<Report<Test>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const test = req.body;
      const author = await userService.getTestAuthor(test.id);

      if (author === undefined || author.id !== (req as unknown as { userId: number }).userId) {
        throw APIError.Forbidden("You do not have permission to edit the requested test.");
      }

      const updatedTest = await testService.update(test);
      res.json({ message: "Test updated successfully.", payload: updatedTest });
    } catch (e) {
      next(e);
    }
  }

  async getBriefTests(
    _req: Request<
      ParamsDictionary,
      Report<BriefTest[]>,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    res: Response<Report<BriefTest[]>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const briefTests = await testService.getBriefTests();
      res.json({ message: "Brief tests retrieved successfully.", payload: briefTests });
    } catch (e) {
      next(e);
    }
  }

  async getBriefTestsCreatedByUser(
    req: Request<ParamsDictionary, Report<BriefTest[]>, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report<BriefTest[]>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authorId = (req as unknown as { userId: number }).userId;
      console.log("authorId: ", authorId);
      const briefTests = await testService.getBriefTestsCreatedByUser(authorId);
      console.log(briefTests);
      console.log("\n\n\n");
      res.json({
        message: "Brief tests created by user received successfully.",
        payload: briefTests,
      });
    } catch (e) {
      next(e);
    }
  }

  async getBriefTestsPassedByUser(
    req: Request<
      ParamsDictionary,
      Report<BriefPassedTest[]>,
      unknown,
      ParsedQs,
      Record<string, unknown>
    >,
    res: Response<Report<BriefPassedTest[]>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passingId = (req as unknown as { userId: number }).userId;
      console.log("passingId: ", passingId);
      const briefTests = await testService.getBriefTestsPassedByUser(passingId);
      console.log(briefTests);
      console.log("\n\n\n");
      res.json({
        message: "Brief tests passed by user received successfully.",
        payload: briefTests,
      });
    } catch (e) {
      next(e);
    }
  }

  async getTestToPass(
    req: Request<ParamsDictionary, Report<Test>, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report<Test>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params["id"]);
      const test = await testService.getTestToPass(id);
      res.json({ message: "Test successfully found.", payload: test });
    } catch (e) {
      next(e);
    }
  }

  async createPassedTest(
    req: Request<ParamsDictionary, Report<Test["id"]>, Test, ParsedQs, Record<string, unknown>>,
    res: Response<Report<Test["id"]>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const test = req.body;
      const testId = await testService.createPassedTest(
        (req as unknown as { userId: number }).userId,
        test,
      );
      res.json({ message: "Test checked successfully.", payload: testId });
    } catch (e) {
      next(e);
    }
  }

  async getPassedTest(
    req: Request<ParamsDictionary, Report<Test>, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report<Test>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params["id"]);
      const test = await testService.getPassedTest(id);
      res.json({ message: "Passed test successfully found.", payload: test });
    } catch (e) {
      next(e);
    }
  }
}

const testController = new TestController();

export { testController };
