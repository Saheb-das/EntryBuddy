// external import
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import Admin from "../models/admin.js";
import Resident from "../models/resident.js";
import Guard from "../models/guard.js";
import createHttpError from "http-errors";

interface IPayload {
  _id: Types.ObjectId;
  email: string;
  role: "admin" | "resident" | "guard";
}

// generate auth token
function genAuthToken(payload: IPayload) {
  return `Bearer ${jwt.sign(payload, process.env.SECRET_KEY || "secreat_key")}`;
}

// verify auth token
function verifyAuthToken(token: string) {
  return jwt.verify(token, process.env.SECRET_KEY || "secreat_key");
}

async function findByRoleAndEmail(role: string, email: string) {
  let user;
  switch (role) {
    case "admin":
      user = await Admin.findOne({ role: role, email: email });
      break;
    case "resident":
      user = await Resident.findOne({ role: role, email: email });
      break;
    case "guard":
      user = await Guard.findOne({ role: role, email: email });
      break;
    default:
      throw createHttpError(401).json({ message: "Invalid role" });
  }

  return user;
}

// export
export default {
  genAuthToken,
  verifyAuthToken,
  findByRoleAndEmail,
};
