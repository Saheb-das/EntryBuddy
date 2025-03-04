// external import
import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// admin schema
const adminSchema = new Schema(
  {
    residents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    guards: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// generate type from schema
export type AdminType = InferSchemaType<typeof adminSchema>;

// create admin model
const Admin = mongoose.models.Admin || model<AdminType>("Admin", adminSchema);

// export
export default Admin;
