// external import
import bcrypt from "bcrypt";

export async function hash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

export async function comparePassword(
  userGivenPassword: string,
  storedPassword: string
) {
  const isValidPassword = await bcrypt.compare(
    userGivenPassword,
    storedPassword
  );
  return isValidPassword;
}
