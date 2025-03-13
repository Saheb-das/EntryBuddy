// external import
import { Schema, model, InferSchemaType } from "mongoose";

// appointment schema
const appointmentSchema = new Schema(
  {
    society: { type: Schema.Types.ObjectId, ref: "Society", required: true },
    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visitor: {
      type: Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    purpose: { type: String, requried: true },
    eventDate: { type: Date, requried: true },
    permissionOTP: { type: Number, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    isConfirm: { type: Boolean, required: true, default: false },
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
