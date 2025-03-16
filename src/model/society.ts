// external import
import { Schema, model, InferSchemaType } from "mongoose";

// appointment schema
const societySchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

// generate type from schema
export type SocietyType = InferSchemaType<typeof societySchema>;

// type without timestamp
export type TSociety = Omit<SocietyType, "createdAt" | "updatedAt">;

// create resident model
const Society = model<SocietyType>("Society", societySchema);

// export
export default Society;
