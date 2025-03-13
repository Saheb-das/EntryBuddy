// types import
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authType";

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.authUser?.role || "")) {
      res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
