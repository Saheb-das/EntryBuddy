// external import
import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// user schema
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      requried: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "resident", "guard"],
      required: true,
    },
    societyId: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// generate type from schema
export type UserType = InferSchemaType<typeof userSchema>;

export type TUser = Omit<UserType, "createdAt" | "updatedAt">;

// create user model
const User = mongoose.models.User || model<UserType>("User", userSchema);

// export
export default User;
