// external import
import express from "express";

// internal import
import authController from "../controller/auth";

// router instanxe
const router = express.Router();

// register route
router.post("/register", authController.register);

// login route
router.post("/login", authController.login);

// forgot password route
router.post("/forgot-password", authController.forgotPassword);

// export
export default router;
