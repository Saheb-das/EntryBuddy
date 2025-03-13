// external imports
import { z } from "zod";
import { passwordValidation } from "./auth";

export const userSchema = z.object({
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
});

export const passwordSchema = z.object({
  newPassword: passwordValidation,
});

export type UserClientType = z.infer<typeof userSchema>;
