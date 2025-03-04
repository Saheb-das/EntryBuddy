// external imports
import createHttpError from "http-errors";

// internal imports
import userService from "../service/user";
import emailService from "../service/email";
import { compareHashedPassword, genHashedPassword } from "../lib/password";
import { genSocietyId } from "../utils/generateIdAndOTP";

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

  const userProfile = await userService.createUserProfile(userData.role);
  if (!userProfile) {
    throw createHttpError(500, "user profile is not created");
  }

  const hashedPassword = await genHashedPassword(userData.password);
  const newSocietyId = genSocietyId(
    userData.role,
    userData.firstName,
    userData.lastName,
    "Hiland Park"
  );

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
    profile: userProfile._id,
  };

  const newUser = await userService.createUser(userPayload);
  if (!newUser) {
    throw createHttpError(500, "user not created");
  }

  // mail service
  await emailService.sendSocietyId(newUser.email, newSocietyId);

  return newUser;
}

// login service
async function login(
  userData: TLoginUser
): Promise<HydratedDocument<UserType>> {
  if (!userData) {
    throw createHttpError(400, "data is required");
  }

  const user = await userService.getUserByEmailAndSociety(
    userData.email,
    userData.societyId
  );
  if (!user) {
    throw createHttpError(404, "user not found");
  }

  return user;
}

// forgot password service
async function forgotPassword(
  email: string,
  societyId: string,
  newPassword: string
): Promise<boolean> {
  const user = await userService.getUserByEmailAndSociety(email, societyId);
  if (!user) {
    throw createHttpError(404, "user not found");
  }

  const hashedPassword = await genHashedPassword(newPassword);

  const updatedUser = await userService.changePassword(
    user._id,
    hashedPassword
  );
  if (!updatedUser) {
    throw createHttpError(404, "user not found");
  }

  const isValid = await compareHashedPassword(
    newPassword,
    updatedUser.password || ""
  );
  if (!isValid) {
    throw createHttpError(304, "password is not modified");
  }

  return isValid;
}

// export
export default {
  register,
  login,
  forgotPassword,
};
