// internal import
import Society from "../model/society";

// types import
import { HydratedDocument, Types } from "mongoose";
import { SocietyType } from "../model/society";

async function findById(
  id: Types.ObjectId
): Promise<HydratedDocument<SocietyType> | null> {
  const society = await Society.findById(id).exec();
  return society;
}

async function create(
  name: string
): Promise<HydratedDocument<SocietyType> | null> {
  const newSociety = new Society(name);
  return await newSociety.save();
}

// export
export default {
  findById,
  create,
};
