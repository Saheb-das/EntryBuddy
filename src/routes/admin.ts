// external imports
import express from "express";

// internal imports
import adminController from "../controller/admin";

// create router
const router = express.Router();

// routes

// create resident by admin
router.post("/create-resident", adminController.createUserByAdmin);

// create guard by admin
router.post("/create-guard", adminController.createUserByAdmin);

// get all residents
router.get("/residents", adminController.getAllResidents);

// get a single resident
router.get("/residents/:residentUserId", adminController.getResident);

// get all guards
router.get("/guards", adminController.getAllGuards);

// get a single guard
router.get("/guards/:guardId", adminController.getGuard);

// export
export default router;
