// external import
import express from "express";

// internal imports
import societyController from "../controller/society";

// create router
const router = express.Router();

// routes
router.get("/", societyController.getAllSociety);

router.get("/:id", societyController.getSociety);

router.get("/:id/role", societyController.getAllUsersByRole);

// export
export default router;
