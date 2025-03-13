// internal import
import Society, { TSociety } from "../model/society";

// types import
import { HydratedDocument, Types } from "mongoose";
import { SocietyType } from "../model/society";

async function findAll(): Promise<HydratedDocument<SocietyType>[] | null> {
  try {
    const societies = await Society.find().exec();
    return societies;
  } catch (error) {
    console.log("Error finding society");
    return null;
  }
}

async function findById(
  id: Types.ObjectId
): Promise<HydratedDocument<SocietyType> | null> {
  const society = await Society.findById(id).exec();
  return society;
}

async function create(
  data: TSociety
): Promise<HydratedDocument<SocietyType> | null> {
  try {
    const newSociety = new Society(data);
    return await newSociety.save();
  } catch (error) {
    console.log("Error creating society", error);
    return null;
  }
}

async function addUserToSociety(
  userId: Types.ObjectId,
  societyId: Types.ObjectId
): Promise<HydratedDocument<SocietyType> | null> {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      societyId,
      { $addToSet: { users: userId } }, // Prevents duplicates
      { new: true, runValidators: true }
    );

    return updatedSociety;
  } catch (error) {
    console.log("Error push user in society", error);
    return null;
  }
}

async function update(
  id: Types.ObjectId,
  field: keyof SocietyType,
  value: any
): Promise<HydratedDocument<SocietyType> | null> {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { [field]: value },
      { new: true }
    );
    return updatedSociety;
  } catch (error) {
    console.log("Error update society", error);
    return null;
  }
}

async function pushUpdate(
  id: Types.ObjectId,
  field: keyof SocietyType,
  value: any
): Promise<HydratedDocument<SocietyType> | null> {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { $push: { [field]: value } },
      { new: true }
    );
    return updatedSociety;
  } catch (error) {
    console.log("Error update society", error);
    return null;
  }
}

async function pullUpdate(
  id: Types.ObjectId,
  field: keyof SocietyType,
  value: any
): Promise<HydratedDocument<SocietyType> | null> {
  try {
    const updatedSociety = await Society.findByIdAndUpdate(
      id,
      { $pull: { [field]: value } },
      { new: true }
    );
    return updatedSociety;
  } catch (error) {
    console.log("Error update society", error);
    return null;
  }
}

// export
export default {
  findAll,
  findById,
  create,
  addUserToSociety,
  update,
  pushUpdate,
  pullUpdate,
};
