// internal imports
import userService from "../service/user";

// types import
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import { verifyAccessToken } from "../lib/jwtToken";
import { AuthRequest } from "../types/authType";

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.headers.authorization;

  try {
    if (!token) {
      throw createHttpError(401, "unauthorized user");
    }

    token = token.split(" ")[1];

    const isVerifiedToken = verifyAccessToken(token);
    if (!isVerifiedToken) {
      throw createHttpError(400, "token verification failed");
    }

    const isExistUser = await userService.getUserById(isVerifiedToken._id);
    if (!isExistUser) {
      throw createHttpError(404, "user not found");
    }

    req.authUser = {
      _id: isExistUser._id,
      role: isExistUser.role,
      societyId: isExistUser.societyId,
      email: isExistUser.email,
      profileId: isExistUser.profile!,
    };

    next();
  } catch (error) {
    next(error);
  }
}
