// external import
import { z } from "zod";

export const passwordValidation = z
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
  role: z.enum(["admin"]),
  occupation: z.string().min(1, "Occupation is required"),
  societyName: z.string().min(3, "minimum 3 charecter required"),
  societyAddress: z.string().min(3, "minimum 3 charecter required"),
});

// login schema from client
export const loginSchema = z.object({
  role: z.enum(["admin", "resident", "guard"]),
  selfId: z.string().min(6, "atleast 6 char requried"),
  email: z.string().email(),
  password: passwordValidation,
});
