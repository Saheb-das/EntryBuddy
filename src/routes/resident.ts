// external imports
import express from "express";

// internal imports
import residentController from "../controller/resident";

// create router
const router = express.Router();

// routes

// get all appointments
router.get("/appointments", residentController.getAllAppointments);

// get a single appointment by id
router.get("/appointments/:appointmentId", residentController.getAppointment);

// resident accept or deny appointment
router.post(
  "/appointment-request/:appointmentId",
  residentController.isConfirmAppointment
);

// update user details [ email, phone-number, occupation ]
router.patch("/edits", residentController.updatesUserProfile);

// export
export default router;
