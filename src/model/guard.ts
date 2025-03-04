// external import
import { Schema, model, InferSchemaType } from "mongoose";

// guard schema
const guardSchema = new Schema(
  {
    appointmentLists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);

// generate type from schema
export type GuardType = InferSchemaType<typeof guardSchema>;

// create guard model
const Guard = model<GuardType>("Guard", guardSchema);

// export
export default Guard;
