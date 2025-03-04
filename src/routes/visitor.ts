// external import
import express from "express";

// internal imports
import visitorController from "../controller/visitor";

// create router
const router = express.Router();

// routes
router.post("/book-appointment", visitorController.bookAppointment);

// export
export default router;
