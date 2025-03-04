// external import
import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// resident schema
const residentSchema = new Schema(
  {
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
export type ResidentType = InferSchemaType<typeof residentSchema>;

// create resident model
const Resident =
  mongoose.models.Resident || model<ResidentType>("Resident", residentSchema);

// export
export default Resident;
