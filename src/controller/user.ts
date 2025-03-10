// external import
import createHttpError from "http-errors";

// internal import
import { userSchema } from "../zod/user";
import userService from "../service/user";

// types import
import { UserClientType } from "../zod/user";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authType";

async function createUser(
  req: AuthRequest<UserClientType>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userData = req.body;

  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized user");
    }

    const societyId = req.authUser.societyId;

    const isValidData = userSchema.safeParse(userData);
    if (!isValidData.success) {
      throw createHttpError(400, "invalid data");
    }

    const newUser = await userService.createUser(isValidData.data, societyId);
    if (!newUser) {
      throw createHttpError(500, "user not created");
    }

    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  createUser,
};
