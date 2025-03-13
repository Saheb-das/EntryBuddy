// external import
import express from "express";

// internal imports
import userController from "../controller/user";
import { authorizeRole } from "../middleware/checkPermission";
import { authenticate } from "../middleware/authenticate";

// create router
const router = express.Router();

// routes
router.post(
  "/",

  authorizeRole(["admin"]),
  userController.createUser
);

router.post(
  "/change-password",
  authorizeRole(["resident, admin, guard"]),
  userController.changePassword
);

router.get("/", userController.getUsers);

router.get("/role", userController.getUsersByRole);

router.get("/:userId", userController.getUser);

router.patch("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

// export
export default router;
