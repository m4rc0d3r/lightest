import { Router } from "express";
import { body } from "express-validator";

import { authController } from "../controllers/auth-controller.js";
import { validationMiddleware } from "../middlewares/validation-middleware.js";

export const router = Router();

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
  authController.register.bind(authController),
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
  authController.login.bind(authController),
);

router.post("/logout", authController.logout.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));
router.get("/activate/:link", authController.activate.bind(authController));
