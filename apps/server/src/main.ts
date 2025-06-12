import { auth2Contract, authContract, testContract } from "@lightest/core";
import { createExpressEndpoints } from "@ts-rest/express";
import { scopePerRequest } from "awilix-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import { either as e } from "fp-ts";

import { tsRestContentTypeMiddleware } from "./infra";
import { createConfig } from "./infra/config/config.js";
import { configureDependencies } from "./infra/dependencies.js";
import { multipartMiddleware } from "./middlewares";
import { authMiddleware } from "./middlewares/auth-middleware.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { validationMiddleware } from "./middlewares/validation-middleware.js";
import { authRouter } from "./routers/auth-router.js";
import { testRouter } from "./routers/test-router.js";
import { createUrl } from "./shared";

import { authRouter as authRouter2 } from "~/features/auth";

expand(dotenvConfig());

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;
const { awilixManager, diContainer } = configureDependencies(config);

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookie.secret));
app.use(cors(config.cors));
app.use(multipartMiddleware());

app.use(scopePerRequest(diContainer));

createExpressEndpoints(authContract, authRouter, app, {
  requestValidationErrorHandler: validationMiddleware(authContract),
});
createExpressEndpoints(testContract, testRouter, app, {
  globalMiddleware: [
    (req, res, next) => {
      if (req.path === testContract.getBriefTests.path) {
        next();
      } else {
        authMiddleware(req as Parameters<typeof authMiddleware>[0], res, next);
      }
    },
  ],
  requestValidationErrorHandler: validationMiddleware(testContract),
});

createExpressEndpoints(auth2Contract, authRouter2, app, {
  globalMiddleware: [tsRestContentTypeMiddleware],
});

app.use(errorMiddleware);

try {
  const { protocol, address, port } = config.server;
  const server = app.listen(port, address, () => {
    void awilixManager.executeInit().then(() => {
      console.log(`Server started on ${createUrl(protocol, address, port)}.`);
    });
  });
  server.on("close", () => {
    void awilixManager.executeDispose();
  });
} catch (e) {
  console.log(e);
}
