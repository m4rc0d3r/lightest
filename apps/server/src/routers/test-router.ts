import { Router } from "express";

import { testController } from "../controllers/test-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

import { withIgnoringPromise } from "./shared.js";

const router: ReturnType<typeof Router> = Router();

router.post("/create", authMiddleware, withIgnoringPromise(testController, "create"));
router.get(
  "/test-to-edit/:id",
  authMiddleware,
  withIgnoringPromise(testController, "getTestToEdit"),
);
router.post("/edit", authMiddleware, withIgnoringPromise(testController, "update"));
router.get("/brief-tests", withIgnoringPromise(testController, "getBriefTests"));
router.get(
  "/created-by-user",
  authMiddleware,
  withIgnoringPromise(testController, "getBriefTestsCreatedByUser"),
);
router.get(
  "/passed-by-user",
  authMiddleware,
  withIgnoringPromise(testController, "getBriefTestsPassedByUser"),
);
router.get(
  "/test-to-pass/:id",
  authMiddleware,
  withIgnoringPromise(testController, "getTestToPass"),
);
router.post(
  "/create-passed",
  authMiddleware,
  withIgnoringPromise(testController, "createPassedTest"),
);
router.get("/passed/:id", authMiddleware, withIgnoringPromise(testController, "getPassedTest"));

export { router };
