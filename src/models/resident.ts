// external import
import { Schema, model, InferSchemaType } from "mongoose";

// create resident schema
const residentSchema = new Schema(
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
    phoneNo: {
      type: String,
      required: true,
    },
    residenceId: { type: String, default: "" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    generatedTokenByAdmin: {
      type: String,
    },
    isExpireGeneratedToken: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "resident", "guard"],
      default: "resident",
    },
    identityDocument: {
      documentType: {
        type: String,
        enum: ["andhar card", "voter card", "passport"],
        default: "andhar card",
      },
      imgUrl: { type: String, default: "" },
    },
    occupation: { type: String, default: "self" },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    avater: { type: String, default: "" },
    documentOfFlatOwnership: {
      residenceType: {
        type: String,
        enum: ["rent", "flat_owner"],
        required: true,
      },
      documentImg: { type: String, default: "" },
    },
    appointmentLists: [
      {
        type: Schema.Types.ObjectId,
        ref: "",
      },
    ],
  },
  { timestamps: true }
);

// generate type from schema
type ResidentType = InferSchemaType<typeof residentSchema>;

// create resident model
const Resident = model<ResidentType>("Resident", residentSchema);

// export
export default Resident;
