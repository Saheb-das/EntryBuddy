// external import
import { Schema, model, InferSchemaType } from "mongoose";

// create a guard schema
const guardSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, default: "" },
    workingId: { type: String },
    isVerified: { type: Boolean, default: false },
    generatedTokenByAdmin: { type: String, require: true },
    role: {
      type: String,
      enum: ["admin", "resident", "guard"],
    },
    identityDocument: {
      documentType: {
        type: String,
        enum: ["andhar card", "voter card", "passport", "other"],
        default: "other",
      },
      imgUrl: { type: String, default: "" },
    },
    password: { type: String },

    appointmentLists: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
  },
  { timestamps: true }
);

// generate type from guard schema
type GuardType = InferSchemaType<typeof guardSchema>;

// create a guard model
const Guard = model<GuardType>("Guard", guardSchema);

// export
export default Guard;
