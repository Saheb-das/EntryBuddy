// internal import
import Guard from "../model/guard";
import appointmentService from "../service/appointment";
import userService from "../service/user";

// types imoprt
import { AppointmentType } from "../model/appointment";
import { GuardType } from "../model/guard";
import { HydratedDocument } from "mongoose";
import createHttpError from "http-errors";

// create new guard object
async function createGuard(): Promise<HydratedDocument<GuardType>> {
  const newGuard = new Guard({});
  return await newGuard.save();
}

// get all appointments
async function getAllAppointments(
  date: string
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const appointments = await appointmentService.getAppointmentsByDate(date);
  return appointments;
}

// get a single appointment
async function getAppointment(
  appointmentId: string
): Promise<HydratedDocument<AppointmentType> | null> {
  const appointment = await appointmentService.getAppointmentByIdWithUsers(
    appointmentId
  );
  return appointment;
}

//get permission of a appointment
async function getAppointmentPermission(
  appointmentId: string,
  permissionOTP: number
): Promise<boolean> {
  const appointment = await appointmentService.getAppointmentById(
    appointmentId
  );
  if (!appointment) {
    throw createHttpError(404, "appointment not found");
  }

  const residentUser = await userService.getUserById(appointment?.resident);
}

// export
export default {
  createGuard,
  getAllAppointments,
  getAppointment,
  getAppointmentPermission,
};
