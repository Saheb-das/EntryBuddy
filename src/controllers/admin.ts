// external import
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

// internal import
import adminService from "../services/admin.js";
import guardService from "../services/guard.js";
import {
  generateVerifyToken,
  genIdByAdmin,
  genPasswordByAdmin,
} from "../utils/generateId.js";
import residentService from "../services/resident.js";
import mailService from "../services/email.js";

// get admin
async function getAdmin(req: Request, res: Response, next: NextFunction) {
  const { role, email, password } = req.body;

  try {
    if (role !== "admin") {
      throw createHttpError(400, "invalid data field");
    }

    if (!email) throw createHttpError(400, "invalid data field");
  } catch (error) {
    next(error);
  }
}

// create resident by admin
async function createResidentByAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, email, phoneNo, residenceType } = req.body;

  try {
    if (!firstName || !lastName || !email || !phoneNo || !residenceType) {
      res.status(400).json({ message: "Invalid data" });
    }

    const residentId = genIdByAdmin(
      "resident",
      firstName,
      lastName,
      "Hiland Park"
    );
    const genPwdByAdmin = genPasswordByAdmin();
    const verifyToken = generateVerifyToken();

    const userObj = {
      firstName,
      lastName,
      email,
      phoneNo,
      residenceType,
      residentId,
      genPwdByAdmin,
      verifyToken,
    };

    const newResident = await residentService.createUser(userObj);

    if (newResident && newResident.residenceId) {
      await mailService.sendMailByAdmin(
        email,
        genPwdByAdmin,
        residentId,
        "resident",
        verifyToken
      );
    }

    res.status(200).json({
      message: "Resident successfully created",
      resident: newResident,
    });
  } catch (error) {
    next(error);
  }
}

// create guard by admin
async function createGuardByAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, phoneNo, email } = req.body;

  try {
    if (!firstName || !lastName || !email || !phoneNo) {
      res.status(400).json({ message: "Invalid data" });
    }

    const workingId = genIdByAdmin("guard", firstName, lastName, "Hiland Park");
    const genPwdByAdmin = genPasswordByAdmin();
    const verifyToken = generateVerifyToken();

    const userObj = {
      firstName,
      lastName,
      phoneNo,
      email,
      verifyToken,
      workingId,
      genPwdByAdmin,
    };
    // console.log("guard will create", userObj);

    const newGuard = await guardService.createUser(userObj);
    if (newGuard && newGuard.workingId) {
      await mailService.sendMailByAdmin(
        email,
        genPwdByAdmin,
        workingId,
        "guard",
        verifyToken
      );
    }

    res
      .status(200)
      .json({ message: "Guard successfully created", guard: newGuard });
  } catch (error) {
    next(error);
  }
}

export default {
  createResidentByAdmin,
  createGuardByAdmin,
};
