import { ContractNoBody, initContract } from "@ts-rest/core";
import { z } from "zod";

const zRegisterReqBody = z.object({
  email: z.string({ message: "Email must be a string." }).email("Invalid email format."),
  password: z
    .string({ message: "Password must be a string." })
    .refine(
      (value) => value.length >= 4 && value.length <= 10,
      "Password must contain at least 4 characters and no more than 10.",
    ),
});

const zRegisterResSuccessfulBody = z.object({
  message: z.string(),
  payload: z.string().jwt(),
});

const zServerErrorSchema = z.object({
  code: z.literal("GENERAL"),
  message: z.string(),
});

const c = initContract();
const authContract = c.router(
  {
    register: {
      method: "POST",
      path: "/register",
      body: zRegisterReqBody,
      responses: {
        200: zRegisterResSuccessfulBody,
        400: z.object({
          code: z.enum(["INVALID_DATA_FORMAT", "EMAIL_IS_BUSY"]),
          message: z.string(),
        }),
      },
    },
    login: {
      method: "POST",
      path: "/login",
      body: zRegisterReqBody,
      responses: {
        200: zRegisterResSuccessfulBody,
        400: z.object({
          code: z.enum(["INVALID_DATA_FORMAT", "EMAIL_NOT_FOUND", "INVALID_PASSWORD"]),
          message: z.string(),
        }),
      },
    },
    logout: {
      method: "POST",
      path: "/logout",
      body: ContractNoBody,
      responses: {
        200: z.object({
          message: z.string(),
        }),
        500: zServerErrorSchema,
      },
    },
    refresh: {
      method: "POST",
      path: "/refresh",
      body: ContractNoBody,
      responses: {
        200: zRegisterResSuccessfulBody,
        500: zServerErrorSchema,
      },
    },
    activate: {
      method: "GET",
      path: "/activate/:link",
      pathParams: z.object({
        link: z.string().uuid(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          code: z.literal("ACTIVATION_LINK_IS_INVALID"),
          message: z.string(),
        }),
      },
    },
  },
  {
    pathPrefix: "/api/auth",
  },
);

export { authContract };
