// external import
import createHttpError from "http-errors";

// internal import
import userRepository from "../repository/user";
import societyRepository from "../repository/society";
import { genInitialPass, genSelfIdForSociety } from "../utils/generateIdAndOTP";
import { genHashedPassword } from "../lib/password";

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

  const initPassword = genInitialPass();
  const hashedPassword = await genHashedPassword(initPassword);
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
  };

  const newUser = await userRepository.create(userPayload);
  if (!newUser) {
    throw createHttpError(500, "user is not created");
  }

  return newUser;
}

// get user by id
async function getUserById(
  id: Types.ObjectId | string
): Promise<HydratedDocument<UserType> | null> {
  if (typeof id === "string") {
    id = new Types.ObjectId(id);
  }

  const user = await userRepository.findById(id);
  return user;
}

// get user by property
async function getUserByEmailAndSelfId(
  email: string,
  selfId: string | Types.ObjectId
): Promise<HydratedDocument<UserType> | null> {
  if (typeof selfId === "string") {
    selfId = new Types.ObjectId(selfId);
  }

  const user = await userRepository.findByEmailAndSelfId(email, selfId);

  return user;
}

// get users by role
async function getUsersByRole(
  role: "resident" | "guard" | "admin"
): Promise<HydratedDocument<UserType>[] | null> {
  const users = await userRepository.findByRole(role);
  return users;
}

// export
export default {
  createUser,
  getUserById,
  getUserByEmailAndSelfId,
  getUsersByRole,
};
