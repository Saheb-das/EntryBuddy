// types imports
import { Request } from "express";
import { Types } from "mongoose";

export interface AuthRequest<ReqBody = {}, Params = {}, Query = {}>
  extends Request<Params, any, ReqBody, Query> {
  authUser?: {
    _id: Types.ObjectId;
    role: "admin" | "resident" | "guard";
    societyId: Types.ObjectId;
    email: string;
  };
}
