import { Router } from "express";

import { userController } from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

export const router = Router();

router.get("/", authMiddleware, userController.getUsers);
