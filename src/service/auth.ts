// external imports
import createHttpError from "http-errors";

// internal imports
import societyRepository from "../repository/society";
import userRepository from "../repository/user";
import emailService from "../service/email";
import { compareHashedPassword, genHashedPassword } from "../lib/password";
import { genSelfIdForSociety } from "../utils/generateIdAndOTP";

// types import
import { TLoginUser, TRegisterUser } from "../types/userTypes";
import { TUser, UserType } from "../model/user";
import { HydratedDocument, Types } from "mongoose";

// register service
async function register(
  userData: TRegisterUser
): Promise<HydratedDocument<UserType>> {
  if (!userData) {
    throw createHttpError(400, "data is required");
  }

  const newSociety = await societyRepository.create(
    userData.societyName.trim()
  );
  if (!newSociety) {
    throw createHttpError(500, "society is not created");
  }

  const hashedPassword = await genHashedPassword(userData.password);
  if (!hashedPassword) {
    throw createHttpError(500, "password is not hashed");
  }

  const newSelfId = genSelfIdForSociety(
    userData.role,
    userData.firstName,
    userData.lastName,
    userData.societyName
  );
  if (!newSelfId) {
    throw createHttpError(500, "self id for society is not created");
  }

  const userPayload: TUser = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
    phoneNo: userData.phoneNo,
    gender: userData.gender,
    role: userData.role,
    selfId: newSelfId,
    occupation: userData.occupation,
    society: newSociety._id,
  };

  const newUser = await userRepository.create(userPayload);
  if (!newUser) {
    throw createHttpError(500, "user not created");
  }

  // mail service
  await emailService.sendSocietyId(newUser.email, newSelfId);

  return newUser;
}

// login service
async function login(
  userData: TLoginUser
): Promise<HydratedDocument<UserType>> {
  let typedSelfId: Types.ObjectId | null = null;

  if (!userData) {
    throw createHttpError(400, "data is required");
  }

  if (typeof userData.selfId === "string") {
    typedSelfId = new Types.ObjectId(userData.selfId);
  }

  const user = await userRepository.findByEmailAndSelfId(
    userData.email,
    typedSelfId!
  );

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  return user;
}

// export
export default {
  register,
  login,
};
