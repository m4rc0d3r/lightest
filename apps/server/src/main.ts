import { Contract, Http } from "@lightest/core";
import { createExpressEndpoints } from "@ts-rest/express";
import { scopePerRequest } from "awilix-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import { either as e } from "fp-ts";

import { Di, TsRest } from "./infra";
import { createConfig } from "./infra/config/config.js";
import { multipartMiddleware } from "./middlewares";

import { authRouter as authRouter2 } from "~/features/auth";

expand(dotenvConfig());

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;
const { awilixManager, diContainer } = Di.configure(config);

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookie.secret));
app.use(cors(config.cors));
app.use(multipartMiddleware());

app.use(scopePerRequest(diContainer));

createExpressEndpoints(Contract.contract.auth, authRouter2, app, {
  globalMiddleware: [
    (...args) =>
      TsRest.Middleware.contentTypeCheck(
        ...(args as Parameters<typeof TsRest.Middleware.contentTypeCheck>),
      ),
  ],
});

try {
  const { address, port } = config.server;
  const server = app.listen(port, address, () => {
    void awilixManager.executeInit().then(() => {
      console.log(`Server started on ${Http.Url.create(config.server)}.`);
    });
  });
  server.on("close", () => {
    void awilixManager.executeDispose();
  });
} catch (e) {
  console.log(e);
}
