// internal import
import Admin from "../models/admin.js";
import { hash } from "../utils/password.js";
import { genIdByAdmin } from "../utils/generateId.js";

interface IAdmin {
  name: string;
  email: string;
  role: "admin" | "resident" | "guard";
  password: string;
  societyName: string;
}

/**
 * @description - This function cerate a new admin user and save in database
 * @param params {CreateUser}
 * @returns - created admin user returned
 */
async function createUser(params: IAdmin) {
  const { name, email, password, role, societyName } = params;

  const hashedPassword = await hash(password);

  let firstName = name.split(" ")[0];
  let lastName = name.split(" ")[1];
  if (!lastName) {
    firstName = name.charAt(0);
    lastName = name.charAt(1);
  }

  const adminIdInSociety = genIdByAdmin(role, firstName, lastName, societyName);

  const newUser = new Admin({
    name,
    email,
    password: hashedPassword,
    role,
    society: {
      societyName,
    },
    societyAdminId: adminIdInSociety,
  });

  return await newUser.save();
}

export default {
  createUser,
};
