import { Router } from "express";

import { testController } from "../controllers/test-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

export const router = Router();

router.post("/create", authMiddleware, testController.create);
router.get("/test-to-edit/:id", authMiddleware, testController.getTestToEdit);
router.post("/edit", authMiddleware, testController.update);
router.get("/brief-tests", testController.getBriefTests);
router.get("/created-by-user", authMiddleware, testController.getBriefTestsCreatedByUser);
router.get("/passed-by-user", authMiddleware, testController.getBriefTestsPassedByUser);
router.get("/test-to-pass/:id", authMiddleware, testController.getTestToPass);
router.post("/create-passed", authMiddleware, testController.createPassedTest);
router.get("/passed/:id", authMiddleware, testController.getPassedTest);
