// external import
import { z } from "zod";

const passwordValidation = z
  .string()
  .min(8)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
  );

// register schema from client
export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: passwordValidation,
  phoneNo: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must only contain digits"),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["admin", "resident", "guard"]),
  occupation: z.string().min(1, "Occupation is required"),
  identityDocName: z.enum(["andhar", "voter", "passport"]),
  identityDocImg: z.string().min(1, "Identity document image is required"),
  societyPropertyDoc: z
    .string()
    .min(1, "Society property document name is required"),
  societyPropertyDocImg: z
    .string()
    .min(1, "Society property document image is required"),
});

// login schema from client
export const loginSchema = z.object({
  role: z.enum(["admin", "resident", "guard"]),
  societyId: z.string().min(6, "atleast 6 char requried"),
  email: z.string().email(),
  password: passwordValidation,
});
