// external import
import createHttpError from "http-errors";

// internal imports
import Resident from "../model/resident";
import appointmentService from "../service/appointment";
import userService from "../service/user";
import visitorService from "../service/visitor";
import emailService from "../service/email";
import { genVerifyToken } from "../utils/generateIdAndOTP";

// types import
import { HydratedDocument, Types } from "mongoose";
import { ResidentType } from "../model/resident";
import { AppointmentType } from "../model/appointment";
import { IEditUser } from "../controller/resident";

// create new resident object
async function createResident(): Promise<HydratedDocument<ResidentType>> {
  const newResident = new Resident({});
  return await newResident.save();
}

// get all appointments
async function getAllAppointments(
  residentId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const residentAppointments = await appointmentService.getUserAppointments(
    residentId
  );
  return residentAppointments;
}

// get a resident appoitment
async function getAppointment(
  residentUserId: Types.ObjectId,
  appointmentId: string
): Promise<HydratedDocument<AppointmentType> | null> {
  const appointment = await appointmentService.getUserAppointment(
    residentUserId,
    appointmentId
  );
  return appointment;
}

// update resident user's profile data
async function updatesUserProfile(
  userId: Types.ObjectId,
  editableData: IEditUser
) {
  const updatedUser = await userService.updateUser(userId, editableData);
  return updatedUser;
}

// resident confirm appointment
async function confirmAppointment(appointmentId: string) {
  // TODO: get appointment
  const appointment = await appointmentService.getAppointmentById(
    appointmentId
  );
  if (!appointment) {
    throw createHttpError(404, "appointment not found");
  }

  if (!appointment.visitor) {
    throw createHttpError(404, "visitor not found");
  }

  const visitor = await visitorService.getVisitorById(appointment?.visitor);
  if (!visitor) {
    throw createHttpError(404, "visitor not found");
  }

  const permissionOTP = Number(genVerifyToken());

  // TODO: email to visitor email and send otp
  await emailService.confirmMailToVisitor(visitor.email, permissionOTP);
}

// resident deny appointment
async function denyAppointment(appointmentId: string) {
  const appointment = await appointmentService.getAppointmentById(
    appointmentId
  );
  if (!appointment) {
    throw createHttpError(404, "appointment not found");
  }

  if (!appointment.visitor) {
    throw createHttpError(404, "visitor not found");
  }

  const visitor = await visitorService.getVisitorById(appointment?.visitor);
  if (!visitor) {
    throw createHttpError(404, "visitor not found");
  }

  // mail to visitor
  await emailService.denyMailToVisitor(visitor.email);

  // delete appointment
  const delAppoint = await appointmentService.deleteById(appointment._id);

  // delete visitor
  const delVisitor = await visitorService.deleteById(visitor._id);
}

// export
export default {
  createResident,
  getAllAppointments,
  getAppointment,
  updatesUserProfile,
  confirmAppointment,
  denyAppointment,
};
