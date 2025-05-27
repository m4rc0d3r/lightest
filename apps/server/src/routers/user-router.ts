import { Router } from "express";

import { userController } from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

import { withIgnoringPromise } from "./shared.js";

const router: ReturnType<typeof Router> = Router();

router.get("/", authMiddleware, withIgnoringPromise(userController, "getUsers"));

export { router };
