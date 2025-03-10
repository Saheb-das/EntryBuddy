// external import
import express from "express";

// internal imports

// create router
const router = express.Router();

// routes
router.post("/", userController.createUser);

router.get("/", userController.getUsers);

router.get("/:userId", userController.getUser);

router.get("/", userController.getUsersByRole);

router.patch("/:userId", userController.updateUser);

router.delete("/:userId", userController.deleteUser);

// export
export default router;
