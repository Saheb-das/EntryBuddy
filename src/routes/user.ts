// external import
import express from "express";

// internal imports
import userController from "../controller/user";
import { authorizeRole } from "../middleware/checkPermission";

// create router
const router = express.Router();

// routes
router.post("/", authorizeRole(["admin"]), userController.createUser);

router.post(
  "/change-password",
  authorizeRole(["resident, admin, guard"]),
  userController.changePassword
);

router.get("/", userController.getUsers);

router.get("/:userId", userController.getUser);

router.get("/", userController.getUsersByRole);

router.patch("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

// export
export default router;
