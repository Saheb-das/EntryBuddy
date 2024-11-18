// external import
import { Schema, model, InferSchemaType } from "mongoose";

// create appointer schema
const appointerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Appointer = model("Appointer", appointerSchema);

// create appointment schema
const appointmentSchema = new Schema(
  {
    issueData: Date,
    appointee: {
      type: Schema.Types.ObjectId,
      ref: "Resident",
    },
    appointer: { type: Schema.Types.ObjectId, ref: "Appointer" },
    appointmentData: Date,
    appointmentStatus: {
      type: String,
      enum: ["pending", "confirm", "cancel"],
    },
  },
  { timestamps: true }
);

// generate type from appointment schema
type AppointmentType = InferSchemaType<typeof appointmentSchema>;

// create appointment model
const Appointment = model<AppointmentType>("Appointment", appointmentSchema);

// export
export default Appointment;
