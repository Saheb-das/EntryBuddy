// external import
import createHttpError from "http-errors";

// internal import
import userRepository from "../repository/user";
import societyRepository from "../repository/society";
import { genSelfIdForSociety } from "../utils/generateIdAndOTP";
import { compareHashedPassword, genHashedPassword } from "../lib/password";
import { convertToObjectId } from "../lib/convertIdType";
import emailService from "./email";

// types import
import { TUser, UserType } from "../model/user";
import { UserClientType } from "../zod/user";
import { HydratedDocument, Types } from "mongoose";

// create new user object
async function createUser(
  userData: UserClientType,
  societyId: Types.ObjectId
): Promise<HydratedDocument<UserType>> {
  const society = await societyRepository.findById(societyId);
  if (!society) {
    throw createHttpError(404, "society not found");
  }

  const newSelfId = genSelfIdForSociety(
    userData.role,
    userData.firstName,
    userData.lastName,
    society.name
  );

  const hashedPassword = await genHashedPassword(userData.password);
  if (!hashedPassword) {
    throw createHttpError(500, "password not hashed");
  }

  const userPayload: TUser = {
    firstName: userData.firstName.toLowerCase(),
    lastName: userData.lastName.toLowerCase(),
    email: userData.email,
    role: userData.role,
    gender: userData.gender,
    occupation: userData.occupation,
    phoneNo: userData.phoneNo,
    password: hashedPassword,
    selfId: newSelfId,
    society: society._id,
    appointments: [],
  };

  const newUser = await userRepository.create(userPayload);
  if (!newUser) {
    throw createHttpError(500, "user is not created");
  }

  // push userId in Society
  const updatedSociety = await societyRepository.addUserToSociety(
    newUser._id,
    society._id
  );
  if (!updatedSociety) {
    throw createHttpError(500, "society not updated");
  }

  // self-id send via email
  const mail = await emailService.sendSelfId(newUser.email, newSelfId);
  if (!mail?.messageId) {
    throw createHttpError(500, "email not sent");
  }

  return newUser;
}

// get user by id
async function getUserById(
  id: Types.ObjectId | string
): Promise<HydratedDocument<UserType> | null> {
  const conId = convertToObjectId(id);

  const user = await userRepository.findById(conId);
  return user;
}

// get user by property
async function getUserByEmailAndSelfId(
  email: string,
  selfId: string
): Promise<HydratedDocument<UserType> | null> {
  const user = await userRepository.findByEmailAndSelfId(email, selfId);

  return user;
}

// get users by role
async function getUsersByRole(
  role: "resident" | "guard" | "admin",
  societyId: Types.ObjectId | string
): Promise<HydratedDocument<UserType>[] | null> {
  const conSocId = convertToObjectId(societyId);

  const users = await userRepository.findByRole(role, conSocId);
  if (!users) {
    throw createHttpError(404, "users not found");
  }

  return users;
}

async function changePassword(
  id: Types.ObjectId,
  oldPassword: string,
  newPassword: string
): Promise<HydratedDocument<UserType> | null> {
  const userId = convertToObjectId(id);

  const isExistUser = await userRepository.findById(userId);
  if (!isExistUser) {
    throw createHttpError(404, "user not found");
  }

  if (!isExistUser.password) {
    throw createHttpError(404, "user password not found");
  }

  const isValidPass = await compareHashedPassword(
    oldPassword,
    isExistUser.password
  );
  if (!isValidPass) {
    throw createHttpError(400, "invalid password");
  }

  const hashedNewPassword = await genHashedPassword(newPassword);
  if (!hashedNewPassword) {
    throw createHttpError(500, "password not hashed");
  }

  const updatedUser = await userRepository.update(
    userId,
    "password",
    hashedNewPassword
  );
  if (!updatedUser) {
    throw createHttpError(500, "user not updated");
  }

  return updatedUser;
}

// export
export default {
  createUser,
  getUserById,
  getUserByEmailAndSelfId,
  getUsersByRole,
  changePassword,
};
