// external import
import express from "express";

// internal imports
import societyController from "../controller/society";

// create router
const router = express.Router();

// routes
router.get("/", societyController.getAllSociety);

// export
export default router;
