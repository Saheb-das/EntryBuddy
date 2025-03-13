// internal import
import User from "../model/user";

// types import
import { HydratedDocument, Types } from "mongoose";
import { UserType, TUser } from "../model/user";

async function findAll(): Promise<HydratedDocument<UserType>[] | null> {
  const users = User.find().exec();
  return users;
}

async function findById(
  id: Types.ObjectId
): Promise<HydratedDocument<UserType> | null> {
  const user = await User.findById(id).exec();
  return user;
}

async function findByEmailAndSelfId(
  email: string,
  selfId: string
): Promise<HydratedDocument<UserType> | null> {
  try {
    const user = await User.findOne({ email: email, selfId: selfId }).exec();
    return user;
  } catch (error) {
    console.log("Error finding user by email and selfId", error);
    return null;
  }
}

type TRole = "admin" | "resident" | "guard";
async function findByRole(
  role: TRole,
  societyId: Types.ObjectId
): Promise<HydratedDocument<UserType>[] | null> {
  const users = await User.find({ role: role, society: societyId }).exec();
  return users;
}

async function create(data: TUser): Promise<HydratedDocument<UserType>> {
  const newUser = new User(data);
  return await newUser.save();
}

async function update(
  id: Types.ObjectId,
  field: keyof UserType,
  value: any
): Promise<HydratedDocument<UserType> | null> {
  try {
    const updatedApp = await User.findByIdAndUpdate(
      id,
      { [field]: value },
      { new: true }
    ).exec();
    return updatedApp;
  } catch (error) {
    console.log("Error updating user");
    return null;
  }
}

async function pushUpdate(
  id: Types.ObjectId,
  field: keyof UserType,
  value: any
): Promise<HydratedDocument<UserType> | null> {
  try {
    const updatedApp = await User.findByIdAndUpdate(
      id,
      { $push: { [field]: value } },
      { new: true }
    ).exec();
    return updatedApp;
  } catch (error) {
    console.log("Error updating user");
    return null;
  }
}
async function pullUpdate(
  id: Types.ObjectId,
  field: keyof UserType,
  value: any
): Promise<HydratedDocument<UserType> | null> {
  try {
    const updatedApp = await User.findByIdAndUpdate(
      id,
      { $pull: { [field]: value } },
      { new: true }
    ).exec();
    return updatedApp;
  } catch (error) {
    console.log("Error updating user");
    return null;
  }
}

async function remove(
  id: Types.ObjectId
): Promise<HydratedDocument<UserType> | null> {
  try {
    const delUser = await User.findByIdAndDelete(id).exec();
    return delUser;
  } catch (error) {
    console.log("Error deleting user", error);
    return null;
  }
}

// export
export default {
  findAll,
  findById,
  findByRole,
  findByEmailAndSelfId,
  create,
  update,
  pushUpdate,
  pullUpdate,
  remove,
};
