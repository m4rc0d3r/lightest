import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { dao } from "./daos/sqlite/dao.js";
import { mailService } from "./services/mail-service.js";
import { router as authRouter } from "./routers/auth-router.js";
import { router as userRouter } from "./routers/user-router.js";
import { router as testRouter } from "./routers/test-router.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "undefined";
const PORT = Number(process.env.PORT || NaN);
const CLIENT_URL = process.env.CLIENT_URL || "undefined";

if (HOSTNAME === "undefined" || isNaN(PORT) || CLIENT_URL === "undefined") {
  throw new Error(
    "'HOSTNAME', 'CLIENT_URL' and/or 'PORT' not specified in the config file '.env'.",
  );
}

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tests", testRouter);

app.use(errorMiddleware);

start();

async function start(): Promise<void> {
  try {
    await dao.init();
    await mailService.init();
    app.listen(PORT, () => {
      console.log(`Server started on http://${HOSTNAME}:${PORT}.`);
    });
  } catch (e) {
    console.log(e);
  }
}
