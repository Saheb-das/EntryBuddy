import { Express, Request } from "express";

declare global {
  namespace Express {
    interface Request {
      authUser?: { _id: string; email: string; role: string; iat: number };
    }
  }
}
