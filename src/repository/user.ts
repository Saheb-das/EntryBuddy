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
  selfId: Types.ObjectId
): Promise<HydratedDocument<UserType> | null> {
  const user = await User.findOne({ email: email, selfId: selfId }).exec();
  return user;
}

type TRole = "admin" | "resident" | "guard";
async function findByRole(
  role: TRole
): Promise<HydratedDocument<UserType>[] | null> {
  const users = await User.find({ role: role }).exec();
  return users;
}

async function create(data: TUser): Promise<HydratedDocument<UserType>> {
  const newUser = new User(data);
  return await newUser.save();
}

async function update() {}

async function remove() {}

// export
export default {
  findAll,
  findById,
  findByRole,
  findByEmailAndSelfId,
  create,
  update,
  remove,
};
