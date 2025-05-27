import { Router } from "express";
import { body } from "express-validator";

import { authController } from "../controllers/auth-controller.js";
import { validationMiddleware } from "../middlewares/validation-middleware.js";

import { withIgnoringPromise } from "./shared.js";

const router: ReturnType<typeof Router> = Router();

router.post(
  "/register",
  body("email")
    .isString()
    .withMessage("Email must be a string.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 4, max: 10 })
    .withMessage("Password must contain at least 4 characters and no more than 10."),
  validationMiddleware,
  withIgnoringPromise(authController, "register"),
);

router.post(
  "/login",
  body("email")
    .isString()
    .withMessage("Email must be a string.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 4, max: 10 })
    .withMessage("Password must contain at least 4 characters and no more than 10."),
  validationMiddleware,
  withIgnoringPromise(authController, "login"),
);

router.post("/logout", withIgnoringPromise(authController, "logout"));
router.post("/refresh", withIgnoringPromise(authController, "refresh"));
router.get("/activate/:link", withIgnoringPromise(authController, "activate"));

export { router };
