// external import
import express from "express";

// internal imports
import appointmentController from "../controller/appointment";
import { authenticate } from "../middleware/authenticate";
import { authorizeRole } from "../middleware/checkPermission";

// create router
const router = express.Router();

// routes
router.post("/", appointmentController.createAppointment);

router.get(
  "/request-me",
  authenticate,
  authorizeRole(["resident"]),
  appointmentController.getRequestAppointments
);

router.post(
  "/confirm",
  authenticate,
  authorizeRole(["resident"]),
  appointmentController.confirmAppointment
);

router.post(
  "/deny",
  authenticate,
  authorizeRole(["resident"]),
  appointmentController.denyAppointment
);

// export
export default router;
