// internal import
import createHttpError from "http-errors";
import Resident from "../models/resident.js";
import { comparePassword, hash } from "../utils/password.js";

interface IResident {
  firstName: string;
  lastName: string;
  email: string;
  residentId: string;
  phoneNo: string;
  genPwdByAdmin: string;
  verifyToken: string;
  residenceType: "flat_owner" | "rent";
}

/**
 * @description - This function cerate a new resident user and save in database
 * @param params {CreateUser}
 * @returns - created resident user returned
 */
async function createUser(params: IResident) {
  const {
    firstName,
    lastName,
    email,
    phoneNo,
    residentId,
    genPwdByAdmin,
    residenceType,
    verifyToken,
  } = params;

  const hashedPassword = await hash(genPwdByAdmin);

  const newResident = new Resident({
    firstName,
    lastName,
    email,
    phoneNo,
    role: "resident",
    generatedTokenByAdmin: verifyToken,
    residenceId: residentId,
    password: hashedPassword,
    documentOfFlatOwnership: {
      residenceType,
    },
  });

  return await newResident.save();
}

/**
 * @description - find user by id and reutrn the user
 * @param id - user id
 * @returns - user object
 */
async function getById(id: string) {
  return await Resident.findById(id);
}

/**
 * @description - This function validate user and change password
 * @param residentId
 * @param oldpassword
 * @param newPassword
 * @returns Object
 */
async function updatePassword(
  residentId: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await getById(residentId);
  if (!user) {
    return createHttpError(400, "user not found");
  }

  const isValidPassword = await comparePassword(oldPassword, user?.password!);
  if (!isValidPassword) {
    throw createHttpError("Invalid old password");
  }

  user.password = await hash(newPassword);

  return await user.save();
}

export default {
  createUser,
  getById,
  updatePassword,
};
