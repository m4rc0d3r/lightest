import type { AxiosError, AxiosResponse } from "axios";

import { defaultAPI } from "@/http/axios/default-api";
import type { Report } from "@/http/dtos/report";
import type { APIError } from "@/http/dtos/api-error";
import type { Test } from "@/dtos/test/base";
import { handleError } from "./helpers";
import type { BriefTest, BriefPassedTest } from "@/dtos/test/brief";

export class TestService {
  static async create(
    test: Test
  ): Promise<AxiosResponse<Report, any> | AxiosError<APIError, any>> {
    try {
      const response = await defaultAPI.post<Report>("tests/create", test);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getTestToEdit(
    id: Test["id"]
  ): Promise<AxiosResponse<Report<Test>, any> | AxiosError<APIError, any>> {
    try {
      const response = await defaultAPI.get<Report<Test>>(
        `tests/test-to-edit/${id}`
      );

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async update(
    test: Test
  ): Promise<AxiosResponse<Report<Test>, any> | AxiosError<APIError, any>> {
    try {
      const response = await defaultAPI.post<Report<Test>>("tests/edit", test);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getBriefTests(): Promise<
    AxiosResponse<Report<BriefTest[]>, any> | AxiosError<APIError, any>
  > {
    try {
      const response = await defaultAPI.get<Report<BriefTest[]>>(
        "tests/brief-tests"
      );

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getBriefTestsCreatedByUser(): Promise<
    AxiosResponse<Report<BriefTest[]>, any> | AxiosError<APIError, any>
  > {
    try {
      const response = await defaultAPI.get<Report<BriefTest[]>>(
        "tests/created-by-user"
      );

      console.log(response);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getBriefTestsPassedByUser(): Promise<
    AxiosResponse<Report<BriefPassedTest[]>, any> | AxiosError<APIError, any>
  > {
    try {
      const response = await defaultAPI.get<Report<BriefPassedTest[]>>(
        "tests/passed-by-user"
      );

      console.log(response);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getTestToPass(
    id: Test["id"]
  ): Promise<AxiosResponse<Report<Test>, any> | AxiosError<APIError, any>> {
    try {
      const response = await defaultAPI.get<Report<Test>>(
        `tests/test-to-pass/${id}`
      );

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async submitTestForReview(
    test: Test
  ): Promise<
    AxiosResponse<Report<Test["id"]>, any> | AxiosError<APIError, any>
  > {
    try {
      const response = (await defaultAPI.post)<Report<Test["id"]>>(
        "tests/create-passed",
        test
      );

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async getPassedTest(
    id: Test["id"]
  ): Promise<AxiosResponse<Report<Test>, any> | AxiosError<APIError, any>> {
    try {
      const response = await defaultAPI.get<Report<Test>>(`tests/passed/${id}`);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }
}
