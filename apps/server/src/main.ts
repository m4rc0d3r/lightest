import { authContract } from "@test-and-be-tested/core";
import { createExpressEndpoints } from "@ts-rest/express";
import { scopePerRequest } from "awilix-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import { either as e } from "fp-ts";

import { createConfig } from "./infra/config/config.js";
import { configureDependencies } from "./infra/dependencies.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { validationMiddleware } from "./middlewares/validation-middleware.js";
import { authRouter } from "./routers/auth-router.js";
import { router as testRouter } from "./routers/test-router.js";
import { router as userRouter } from "./routers/user-router.js";
import { createUrl } from "./shared";

expand(dotenvConfig());

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;
const { awilixManager, diContainer } = configureDependencies(config);

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookie.secret));
app.use(cors(config.cors));

app.use(scopePerRequest(diContainer));

app.use("/api/users", userRouter);
app.use("/api/tests", testRouter);

createExpressEndpoints(authContract, authRouter, app, {
  requestValidationErrorHandler: validationMiddleware(authContract),
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
