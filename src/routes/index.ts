// external import
import express from "express";

// internal import
import authRoutes from "./auth";
import userRoutes from "./user";
import appointmentRoutes from "./appointment";
import visitorRoutes from "./visitor";
import { authenticate } from "../middleware/authenticate";

// router instance
const router = express.Router();

// use other routes
router.use("/auth", authRoutes);
router.use("/users", authenticate, userRoutes);
router.use("/appointments", authenticate, appointmentRoutes);
router.use("/visitors", authenticate, visitorRoutes);

// export
export default router;
