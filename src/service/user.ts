// external imports
import createHttpError from "http-errors";
import mongoose from "mongoose";

// internal imports
import adminService from "../service/admin";
import residentService from "../service/resident";
import guardService from "../service/guard";
import User from "../model/user";

// types imports
import { TUser } from "../model/user";
import { HydratedDocument, Types } from "mongoose";
import { TRegisterUser, TUserInput } from "../types/userTypes";
import { UserType } from "../model/user";
import { AdminType } from "../model/admin";
import { ResidentType } from "../model/resident";
import { GuardType } from "../model/guard";
import { IEditUser } from "../controller/resident";

type TUserProfile = TRegisterUser["role"];
type TProfile = AdminType | ResidentType | GuardType;

// create user profile object dynamically
async function createUserProfile(
  role: TUserProfile
): Promise<HydratedDocument<TProfile>> {
  let profile: HydratedDocument<TProfile>;

  switch (role) {
    case "admin":
      profile = await adminService.createAdmin();
      break;
    case "resident":
      profile = await residentService.createResident();
      break;
    case "guard":
      profile = await guardService.createGuard();
      break;
    default:
      throw createHttpError(400, "invalid role");
  }

  return profile;
}

// create new user object
async function createUser(
  userPayload: TUser
): Promise<HydratedDocument<UserType>> {
  const newUser = new User(userPayload);
  return await newUser.save();
}

// get user by id
async function getUserById(
  id: Types.ObjectId | string
): Promise<HydratedDocument<UserType> | null> {
  const user = await User.findById(id).exec();
  return user;
}

// get user by property
async function getUserByEmailAndSociety(
  email: string,
  societyId: string
): Promise<HydratedDocument<UserType> | null> {
  const user = await User.findOne({ email, societyId }).exec();

  return user;
}

// chnage password
async function changePassword(
  id: Types.ObjectId,
  newHashedPassword: string
): Promise<HydratedDocument<UserType> | null> {
  return await User.findByIdAndUpdate(
    id,
    { password: newHashedPassword },
    { new: true }
  );
}

// get user with profile
async function getUserWithRole(
  userId: string,
  userRole: string
): Promise<HydratedDocument<UserType> | null> {
  const userWithProfile = await User.findOne({ _id: userId, role: userRole })
    // .populate("profile")
    .exec();
  return userWithProfile;
}

// get all resident users
async function getResidentUsers(): Promise<
  HydratedDocument<UserType>[] | null
> {
  const residentUsers = await User.find({ role: "resident" }).exec();
  return residentUsers;
}

// get all guard users
async function getGuardUsers(): Promise<HydratedDocument<UserType>[] | null> {
  const guardUsers = await User.find({ role: "guard" }).exec();
  return guardUsers;
}

// update user's data
async function updateUser(
  userId: Types.ObjectId,
  editableData: IEditUser
): Promise<HydratedDocument<UserType> | null> {
  const updatedUser = await User.findByIdAndUpdate(userId, editableData, {
    new: true,
  });
  return updatedUser;
}

/*

// update user
async function updateUser(
  id: string,
  data: Partial<UserType>
): Promise<HydratedDocument<UserType> | null> {}

// delete user
async function deleteUser(
  id: string
): Promise<HydratedDocument<UserType> | null> {}

*/

// export
export default {
  createUserProfile,
  createUser,
  getUserById,
  getUserByEmailAndSociety,
  changePassword,
  getUserWithRole,
  getResidentUsers,
  getGuardUsers,
  updateUser,
  // deleteUser,
};
