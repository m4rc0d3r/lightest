import cookieParser from "cookie-parser";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import { expand } from "dotenv-expand";
import express from "express";
import { either as e } from "fp-ts";

import { dao } from "./daos/postgres/dao.js";
import { createConfig } from "./infra/config/config.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";
import { router as authRouter } from "./routers/auth-router.js";
import { router as testRouter } from "./routers/test-router.js";
import { router as userRouter } from "./routers/user-router.js";
import { mailService } from "./services/mail-service.js";
import { createUrl } from "./shared";

expand(dotenvConfig());

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookie.secret));
app.use(cors(config.cors));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tests", testRouter);

app.use(errorMiddleware);

await start();

async function start(): Promise<void> {
  try {
    await dao.init();
    await mailService.init();
    const { protocol, address, port } = config.server;
    app.listen(port, address, () => {
      console.log(`Server started on ${createUrl(protocol, address, port)}.`);
    });
  } catch (e) {
    console.log(e);
  }
}
