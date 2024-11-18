// external import
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

// internal import
import authService from "../services/auth.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization;
  console.log("token", token);

  try {
    if (!token) {
      return res.status(401).json("Unauthorized");
    }

    token = token.split(" ")[1];
    console.log("token:", token);

    const authUser = authService.verifyAuthToken(token);
    req.authUser = authUser as {
      _id: string;
      email: string;
      role: string;
      iat: number;
    };
    console.log("after verify user:", authUser);

    // check user

    next();
  } catch (error) {
    next(createHttpError(400, "Invalid token"));
  }
}
