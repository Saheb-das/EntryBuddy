// external import
import express from "express";

// internal import
import authRoutes from "./auth";
import adminRoutes from "./admin";
import guardRoutes from "./guard";
import residentRoutes from "./resident";
import { authenticate } from "../middleware/authenticate";

// router instanxe
const router = express.Router();

// use other routes
router.use("/auth", authRoutes);
router.use("/admin", authenticate, adminRoutes);
router.use("/resident", authenticate, residentRoutes);
router.use("/guard", authenticate, guardRoutes);

// export
export default router;
