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
import { HydratedDocument } from "mongoose";

// register service
async function register(
  userData: TRegisterUser
): Promise<HydratedDocument<UserType>> {
  if (!userData) {
    throw createHttpError(400, "data is required");
  }

  const societyPayload = {
    name: userData.societyName.trim().toLowerCase(),
    users: [],
    appointments: [],
  };

  const newSociety = await societyRepository.create(societyPayload);
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

  // push userId in Society
  const updatedSociety = await societyRepository.addUserToSociety(
    newUser._id,
    newSociety._id
  );
  if (!updatedSociety) {
    throw createHttpError(500, "society not updated");
  }

  // mail service
  await emailService.sendSocietyId(newUser.email, newSelfId);

  return newUser;
}

// login service
async function login(
  userData: TLoginUser
): Promise<HydratedDocument<UserType>> {
  if (!userData) {
    throw createHttpError(400, "data is required");
  }

  const user = await userRepository.findByEmailAndSelfId(
    userData.email,
    userData.selfId
  );

  if (!user) {
    throw createHttpError(404, "user not found");
  }

  if (!user.password) {
    throw createHttpError(404, "user has no password");
  }

  const isValidPass = await compareHashedPassword(
    userData.password,
    user.password
  );
  if (!isValidPass) {
    throw createHttpError(401, "invalid credential");
  }

  return user;
}

// export
export default {
  register,
  login,
};
