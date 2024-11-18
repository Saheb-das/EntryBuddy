// external import
import { Router } from "express";

// internal import
import authController from "../controllers/auth.js";

// create router
const router = Router();

// sign-up for admin
router.post("/sign-up", authController.createAdmin);

// login route
router.post("/login", authController.login);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password", authController.resetPassword);

// export
export default router;
