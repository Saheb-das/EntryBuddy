// external imports
import express from "express";

// internal import
import guardController from "../controller/guard";

// create router
const router = express.Router();

// routes

// get appointments
router.get("/appointments", guardController.getAllAppointments);

// get single appointments
router.get("/appointments/:appointmentId", guardController.getAppointment);

// confirm appointment by otp
router.post(
  "/appointments/:appointmentId/permission",
  guardController.getPermission
);

// export
export default router;
