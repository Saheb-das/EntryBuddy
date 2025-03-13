// external import
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// internal import
import { loginSchema, registerSchema } from "../zod/auth";
import authService from "../service/auth";
import { genJwtAccessToken } from "../lib/jwtToken";

// register controller
async function register(req: Request, res: Response, next: NextFunction) {
  const userData = req.body;

  try {
    const isValidData = registerSchema.safeParse(userData);
    if (!isValidData.success) {
      throw createHttpError(400, "invalid data");
    }

    const newUser = await authService.register(isValidData.data);
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

// login controller
async function login(req: Request, res: Response, next: NextFunction) {
  const userData = req.body;

  try {
    const isValidData = loginSchema.safeParse(userData);
    if (!isValidData.success) {
      throw createHttpError(400, isValidData.error.message);
    }

    const loggedInUser = await authService.login(userData);
    if (!loggedInUser) {
      throw createHttpError(404, "user not found");
    }

    const userJwtPayload = {
      _id: loggedInUser._id,
      email: loggedInUser.email,
      role: loggedInUser.role,
    };

    const accessToken = genJwtAccessToken(userJwtPayload);

    res.status(200).json({
      success: true,
      message: "user login successfully",
      token: accessToken,
      user: loggedInUser,
    });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  register,
  login,
};
