// external imports
import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phoneNo: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone number must only contain digits"),
  gender: z.enum(["male", "female", "other"]),
  societyName: z.string().min(6, "society name is required"),
  role: z.enum(["admin", "resident", "guard"]),
  occupation: z.string().min(1, "Occupation is required"),
});
