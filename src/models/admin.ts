// external import
import { Schema, model, InferSchemaType } from "mongoose";

// create admin schema
const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "resident", "guard"],
    },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    societyAdminId: { type: String },
    society: {
      societyName: {
        type: String,
        required: true,
      },
      isOwner: { type: Boolean, default: false },
    },
    numberOfResidence: { type: Number, default: 0 },
    listOfResidence: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resident",
      },
    ],
  },
  { timestamps: true }
);

// infer type from schema
type AdminType = InferSchemaType<typeof adminSchema>;

// create admin model
const Admin = model<AdminType>("Admin", adminSchema);

// export
export default Admin;
