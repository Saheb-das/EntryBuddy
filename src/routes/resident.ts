// external import
import { Router } from "express";

// internal import
import residentController from "../controllers/resident.js";

// create router
const router = Router();

// define resident route

// get single resident
router.get("/resident", (req, res) => {
  res.json({ message: "resident route" });
});

// create resident
router.post("", () => {});

// change password
router.patch("/:residentId/change-password", residentController.changePassword);

// delete resident
router.delete("/:residentId", () => {});

// export
export default router;
