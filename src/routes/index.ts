// external import
import { Router } from "express";

// internal import
import adminRoutes from "./admin.js";
import residentRoutes from "./resident.js";
import guardRoutes from "./guard.js";
import settingRoutes from "./setting.js";
import authRoutes from "./auth.js";
import { authenticate } from "../middlewares/authenticate.js";

// create router
const router = Router();

// define routes
router.use("/auth", authRoutes); // auth route
router.use("/admin", authenticate, adminRoutes); // admin route
router.use("/resident", authenticate, residentRoutes); // resident route
router.use("/guard", authenticate, guardRoutes); // guard route
router.use("/setting", settingRoutes); // TODO: may be include or not

// exports
export default router;
