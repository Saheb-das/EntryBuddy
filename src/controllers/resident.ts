// external import
import { NextFunction, Request, Response } from "express";

// internal import
import residentService from "../services/resident.js";
import createHttpError from "http-errors";

// create a new resident
async function createResident(req: Request, res: Response, next: NextFunction) {
  const { name, email, phoneNo, role, residenceType } = req.body;
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  const { oldPassword, newPassword } = req.body;
  const { residentId } = req.params;
  const authUser = req.authUser;

  try {
    if (authUser?._id !== residentId)
      throw createHttpError(400, "Invalid User id");

    if (authUser?.role !== "resident")
      throw createHttpError(400, "Invalid role");

    const updatedUser = await residentService.updatePassword(
      residentId,
      oldPassword,
      newPassword
    );
    if (!updatedUser) {
      throw createHttpError(400, "user not save");
    }

    res
      .status(200)
      .json({ message: "password change successful", success: "ok" });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  createResident,
  changePassword,
};
