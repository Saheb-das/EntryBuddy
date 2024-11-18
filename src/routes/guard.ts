// external import
import { Router } from "express";

// create router
const router = Router();

// define guard routes

// get a single guard
router.get("/guard", (req, res) => {
  res.json({ message: "guard route" });
});

// create guard
router.post("/guard", () => {});

// update guard
router.patch("/guard/:guardId", () => {});

// delete guard
router.delete("/guard/:guardId", () => {});

// export
export default router;
