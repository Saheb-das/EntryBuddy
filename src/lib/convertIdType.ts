import { Types } from "mongoose";

export function convertToObjectId(id: string | Types.ObjectId): Types.ObjectId {
  if (typeof id === "string") {
    return new Types.ObjectId(id);
  }

  return id;
}
