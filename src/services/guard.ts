// internal import
import Guard from "../models/guard.js";
import { hash } from "../utils/password.js";

interface IGuard {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  verifyToken: string;
  workingId: string;
  genPwdByAdmin: string;
}

/**
 * @description - This function save guard info to database
 * @param param {Createuser} - information about guard
 * @returns - return a new guard user
 */
async function createUser(param: IGuard) {
  const {
    firstName,
    lastName,
    phoneNo,
    email,
    verifyToken,
    workingId,
    genPwdByAdmin,
  } = param;

  const hashedPassword = await hash(genPwdByAdmin);
  console.log("before line to create a guard");

  const newGuard = new Guard({
    firstName,
    lastName,
    email,
    phoneNo,
    role: "guard",
    generatedTokenByAdmin: verifyToken,
    workingId,
    password: hashedPassword,
  });

  return await newGuard.save();
}

// export
export default {
  createUser,
};
