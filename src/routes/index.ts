// external import
import express from "express";

// internal import
import authRoutes from "./auth";
import userRoutes from "./user";
import appointmentRoutes from "./appointment";
import societyRoutes from "./society";
import { authenticate } from "../middleware/authenticate";

// router instance
const router = express.Router();

// use other routes
router.use("/auth", authRoutes);
router.use("/societies", societyRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/appointments", appointmentRoutes);

// export
export default router;
