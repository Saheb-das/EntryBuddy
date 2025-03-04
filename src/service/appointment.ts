// internal imports
import Appointment from "../model/appointment";

// types imports
import { AppointmentType, TAppointment } from "../model/appointment";
import { HydratedDocument, Types } from "mongoose";

// get appointment by id
async function getAppointmentById(
  appointmentId: string
): Promise<HydratedDocument<AppointmentType> | null> {
  const appointment = await Appointment.findById(appointmentId).exec();
  return appointment;
}

// get all user's appointments
async function getUserAppointments(
  residentId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const userAppointments = await Appointment.find({
    resident: residentId,
  }).exec();
  return userAppointments;
}

// get user's appointment
async function getUserAppointment(
  userId: Types.ObjectId,
  appointmentId: string
): Promise<HydratedDocument<AppointmentType> | null> {
  const userAppointment = await Appointment.findOne({
    resident: userId,
    _id: appointmentId,
  })
    .populate([{ path: "resident" }, { path: "visitor" }])
    .exec();
  return userAppointment;
}

// get all user's appointments
async function getAppointmentsByDate(
  date: string
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const appointments = await Appointment.find({ eventDate: date }).exec();
  return appointments;
}

// get appointment by id
async function getAppointmentByIdWithUsers(
  appointmentId: string
): Promise<HydratedDocument<AppointmentType> | null> {
  const appointment = await Appointment.findById(appointmentId)
    .populate([{ path: "resident" }, { path: "visitor" }])
    .exec();

  return appointment;
}

// create new appointment
async function createNewAppointment(
  appointmentPayload: TAppointment
): Promise<HydratedDocument<AppointmentType>> {
  const newAppointment = new Appointment(appointmentPayload);
  return await newAppointment.save();
}

async function deleteById(id: Types.ObjectId) {
  const deletedAppointment = await Appointment.findByIdAndDelete(id).exec();
}

// export
export default {
  getUserAppointments,
  getUserAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  getAppointmentByIdWithUsers,
  createNewAppointment,
  deleteById,
};
