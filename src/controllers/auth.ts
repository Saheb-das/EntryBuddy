// external import
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// internal import
import Admin from "../models/admin.js";
import Resident from "../models/resident.js";
import Guard from "../models/guard.js";
import { comparePassword, hash } from "../utils/password.js";
import authService from "../services/auth.js";
import adminService from "../services/admin.js";
import emailService from "../services/email.js";
import { generateVerifyToken } from "../utils/generateId.js";

// sign-up for only admin
async function createAdmin(req: Request, res: Response, next: NextFunction) {
  const { role, name, email, password, societyName } = req.body;

  try {
    if (!role || !name || !email || !password || !societyName) {
      res.status(400).json({ message: "Invalid data" });
    }

    if (role !== "admin")
      res.status(400).json({ message: "only admin can signup" });

    const userObj = {
      role,
      name,
      email,
      password,
      societyName,
    };

    const newUser = await adminService.createUser(userObj);

    res
      .status(200)
      .json({ message: "admin created successfully", admin: newUser });
  } catch (error) {
    next(error);
  }
}

// login controller
async function login(req: Request, res: Response, next: NextFunction) {
  const { role, email, societyId, password } = req.body;
  console.log("login controller called");

  try {
    if (!role || !email || !societyId || !password)
      throw createHttpError(400, "invalid data field");

    let user;
    switch (role) {
      case "admin":
        user = await Admin.findOne({ societyAdminId: societyId, email: email });
        break;
      case "resident":
        user = await Resident.findOne({ residenceId: societyId, email: email });
        break;
      case "guard":
        user = await Guard.findOne({ workingId: societyId, email: email });
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    if (!user) throw createHttpError(400, "user not found");

    const isValidPassword = await comparePassword(password, user.password!);
    if (!isValidPassword) throw createHttpError(400, "Invalid credential");

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role!,
    };

    const token = authService.genAuthToken(payload);

    res.status(200).json({
      message: "User successfully Logged In",
      status: true,
      authToken: token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// forgot password
async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  const { role, email } = req.body;

  try {
    if (!role || !email) throw createHttpError(400, "Invalid Credential");

    // find user
    const user = await authService.findByRoleAndEmail(role, email);
    if (!user) {
      throw createHttpError(400, "Invalid user");
    }

    const otp = generateVerifyToken();

    await emailService.sendOtpByMail(email, otp);

    res
      .status(200)
      .json({ message: "OTP sent", success: "ok", verifyOTP: otp });

    // send mail
  } catch (error) {
    next(error);
  }
}

// reset password
async function resetPassword(req: Request, res: Response, next: NextFunction) {
  const { role, email, newPassword } = req.body;

  try {
    if (!role || !email) throw createHttpError(400, "Invalid data");

    const user = await authService.findByRoleAndEmail(role, email);
    if (!user) throw createHttpError("Invalid user");

    const hashedNewPassword = await hash(newPassword);

    user.password = hashedNewPassword;
    console.log();

    await user.save();

    res.status(200).json({
      message: "New password reset",
      success: "ok",
    });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  createAdmin,
  login,
  forgotPassword,
  resetPassword,
};
