// external import
import { Schema, model, InferSchemaType } from "mongoose";

// appointment schema
const appointmentSchema = new Schema(
  {
    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: "Visitor",
    },
    purpose: String,
    eventDate: { type: String, requried: true },
    permissionOTP: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// generate type from schema
export type AppointmentType = InferSchemaType<typeof appointmentSchema>;

// type without timestamp
export type TAppointment = Omit<AppointmentType, "createdAt" | "updatedAt">;

// create resident model
const Appointment = model<AppointmentType>("Appointment", appointmentSchema);

// export
export default Appointment;
