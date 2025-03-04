// external imports
import createHttpError from "http-errors";

// internal imports
import Admin from "../model/admin";
import emailService from "../service/email";
import { genInitialPass, genSocietyId } from "../utils/generateIdAndOTP";
import { genHashedPassword } from "../lib/password";
import userService from "../service/user";

// types imports
import { AdminType } from "../model/admin";
import { HydratedDocument, Types } from "mongoose";
import { TUserInput } from "../types/userTypes";
import { TUser, UserType } from "../model/user";

// create new admin object
async function createAdmin(): Promise<HydratedDocument<AdminType>> {
  const newAdmin = new Admin({});
  return await newAdmin.save();
}

// get admin
async function getAdminById(
  adminId: Types.ObjectId
): Promise<HydratedDocument<AdminType> | null> {
  const isExistAdmin = await Admin.findById(adminId).exec();
  return isExistAdmin;
}

// create resident by admin
async function createUserByAdmin(
  userData: TUserInput
): Promise<HydratedDocument<UserType>> {
  // initial password created
  const initPassword = genInitialPass();
  if (!initPassword) {
    throw createHttpError(500, "initial password not created");
  }

  // password hashed
  const hashedPassword = await genHashedPassword(initPassword);
  if (!hashedPassword) {
    throw createHttpError(500, "password is not hashed");
  }

  // society id created
  const newSocietyId = genSocietyId(
    userData.role,
    userData.firstName,
    userData.lastName,
    userData.societyName
  );
  if (!newSocietyId) {
    throw createHttpError(500, "society id is not created");
  }

  // resident  profile created
  const newUserProfile = await userService.createUserProfile(userData.role);
  if (!newUserProfile) {
    throw createHttpError(500, "resident profile is not created");
  }

  // resident user payload
  const userPayload: TUser = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    phoneNo: userData.phoneNo,
    gender: userData.gender,
    role: userData.role,
    societyId: newSocietyId,
    occupation: userData.occupation,
    documents: {
      identity: {
        docName: userData.identityDocName,
        docImg: userData.identityDocImg,
      },
      society: {
        docName: userData.societyPropertyDoc,
        docImg: userData.societyPropertyDocImg,
      },
    },
    profile: newUserProfile._id,
  };

  // resident user created
  const newUser = await userService.createUser(userPayload);
  if (!newUser) {
    throw createHttpError(500, "new user is not created");
  }

  // email send to resident
  await emailService.sendMailByAdmin(newUser.email, initPassword, newSocietyId);

  return newUser;
}

// update admin object with resident or guard id
async function updateAdminWithUserId(
  adminId: Types.ObjectId,
  role: "resident" | "guard" | "admin",
  updateUserId: Types.ObjectId
): Promise<HydratedDocument<AdminType> | null> {
  const roleField = role === "resident" ? "residents" : "guards";

  const updatedUser = await Admin.findOneAndUpdate(
    { _id: adminId },
    { $push: { [roleField]: updateUserId } },
    {
      new: true, // Return the updated document
      // upsert: false, // Do not create a new document if no match is found
    }
  );

  return updatedUser;
}

// get a single resident by id
async function getResident(
  residentUserId: string
): Promise<HydratedDocument<UserType> | null> {
  const residentUser = await userService.getUserWithRole(
    residentUserId,
    "resident"
  );
  if (!residentUser) {
    throw createHttpError(404, "resident user is not found");
  }

  return residentUser;
}

// get all residents
async function getAllResidents(): Promise<HydratedDocument<UserType>[] | null> {
  const residentUsers = await userService.getResidentUsers();
  if (!residentUsers) {
    throw createHttpError(404, "resident users are not found");
  }

  return residentUsers;
}

// get a sungle guard
async function getGuard(
  guardUserId: string
): Promise<HydratedDocument<UserType> | null> {
  const guardUser = await userService.getUserWithRole(guardUserId, "guard");
  return guardUser;
}

// get all guards
async function getAllGuards(): Promise<HydratedDocument<UserType>[] | null> {
  const guardUsers = await userService.getGuardUsers();
  return guardUsers;
}

// export
export default {
  createAdmin,
  getAdminById,
  createUserByAdmin,
  updateAdminWithUserId,
  getResident,
  getAllResidents,
  getGuard,
  getAllGuards,
};
