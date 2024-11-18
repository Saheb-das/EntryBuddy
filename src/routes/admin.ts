// external import
import { Router } from "express";

// internal import
import adminController from "../controllers/admin.js";

// create router
const router = Router();

// define all admin needed routes

// create resident by admin
router.post("/create-resident", adminController.createResidentByAdmin);

// create guard by guard
router.post("/create-guard", adminController.createGuardByAdmin);

// update admin
router.patch("/:adminId", () => {});

// delete admin
router.delete("/:adminId", () => {});

// export
export default router;
