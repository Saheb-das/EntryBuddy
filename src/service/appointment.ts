// external import
import createHttpError from "http-errors";

// internal imports
import emailService from "../service/email";
import appointmentRepository from "../repository/appointment";
import visitorRepository from "../repository/visitor";
import userRepository from "../repository/user";
import societyRepository from "../repository/society";
import { genOTP } from "../utils/generateIdAndOTP";

// types imports
import { AppointmentType, TAppointment } from "../model/appointment";
import { HydratedDocument, Types } from "mongoose";
import { TVisitorInput } from "../types/userTypes";
import { TAppointmentInput } from "../types/appointmentType";
import { convertToObjectId } from "../lib/convertIdType";

// get appointment by id
async function getAppointmentById(
  id: string | Types.ObjectId
): Promise<HydratedDocument<AppointmentType> | null> {
  const convertedId = convertToObjectId(id);

  const appointment = await appointmentRepository.findById(convertedId);
  if (!appointment) {
    throw createHttpError(404, "appointment not found");
  }

  return appointment;
}

// get all appointments of a particular resident
async function getAppointmentsByUserId(
  userId: string | Types.ObjectId,
  societyId: string | Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const id = convertToObjectId(userId);
  const socId = convertToObjectId(societyId);

  const appointments = await appointmentRepository.findByUserId(id, socId);
  if (!appointments) {
    throw createHttpError(404, "appointment not found");
  }

  return appointments;
}

// get all appointments (From start-date To end-date)
async function getAppointmentsByDateRange(
  startDate: string,
  endDate: string,
  societyId: Types.ObjectId | string
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const startISO = new Date(startDate);
  const endISO = new Date(endDate);
  const conSocietyId = convertToObjectId(societyId);

  const appointments = await appointmentRepository.findByDateRange(
    startISO,
    endISO,
    conSocietyId
  );
  if (!appointments) {
    throw createHttpError(404, "appointment not found");
  }

  return appointments;
}

// get all user's appointments (Date format: yyyy-mm-dd)
async function getAppointmentsByDate(
  date: string,
  societyId: Types.ObjectId | string
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const dateInISO = new Date(date);
  const conSocietyId = convertToObjectId(societyId);

  const appointments = await appointmentRepository.findByExectDate(
    dateInISO,
    conSocietyId
  );
  if (!appointments) {
    throw createHttpError(404, "appointment not found");
  }

  return appointments;
}

// create new appointment
async function makeAppointment(
  visitorData: TVisitorInput,
  appointmentData: TAppointmentInput,
  userId: Types.ObjectId,
  societyId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>> {
  const newVisitor = await visitorRepository.create(visitorData);
  if (!newVisitor) {
    throw createHttpError(500, "visitor not created");
  }

  const newOTP = Number(genOTP());
  if (!newOTP) {
    throw createHttpError(500, "OTP is not generated");
  }

  const appointmentPayload: TAppointment = {
    society: societyId,
    resident: userId,
    visitor: newVisitor._id,
    purpose: appointmentData.purpose,
    eventDate: new Date(appointmentData.eventDate),
    permissionOTP: newOTP,
    isVerified: false,
    isConfirm: false,
  };

  const newAppointment = await appointmentRepository.create(appointmentPayload);
  if (!newAppointment) {
    throw createHttpError(500, "appointment is not created");
  }

  return newAppointment;
}

// confirm appointment
async function confirmAppointment(
  appointmentId: string | Types.ObjectId,
  userId: string | Types.ObjectId
): Promise<HydratedDocument<AppointmentType> | null> {
  const conAppointmentId = convertToObjectId(appointmentId);
  const conUserId = convertToObjectId(userId);

  // update confirm in appointment
  const updatedAppointment = await appointmentRepository.update(
    conAppointmentId,
    "isConfirm",
    true
  );
  if (!updatedAppointment) {
    throw createHttpError(500, "appointment confirm not updated");
  }

  // add appointment to user
  const updatedUserWithNewAppoint = await userRepository.pushUpdate(
    conUserId,
    "appointments",
    updatedAppointment._id
  );
  if (!updatedUserWithNewAppoint) {
    throw createHttpError(500, "user not updated with confirm appointment");
  }

  // add appointment to society
  const updatedSociety = await societyRepository.pushUpdate(
    updatedAppointment.society,
    "appointments",
    updatedAppointment._id
  );
  if (!updatedSociety) {
    throw createHttpError(500, "society update failed");
  }

  const existVisitor = await visitorRepository.findById(
    updatedAppointment.visitor
  );
  if (!existVisitor) {
    throw createHttpError(404, "visitor not found");
  }

  // send mail to visitor
  const confirmationMail = await emailService.confirmMailToVisitor(
    existVisitor.email,
    Number(genOTP)
  );
  if (!confirmationMail?.messageId) {
    throw createHttpError(500, "email not sent");
  }

  return updatedAppointment;
}

// delete appointment
async function deleteAppointment(id: Types.ObjectId | string) {
  const convertedId = convertToObjectId(id);

  const delAppointment = await appointmentRepository.remove(convertedId);
  if (!delAppointment) {
    throw createHttpError(404, "appointment not found");
  }

  return delAppointment;
}

// export
export default {
  getAppointmentsByUserId,
  getAppointmentById,
  getAppointmentsByDateRange,
  getAppointmentsByDate,
  makeAppointment,
  confirmAppointment,
  deleteAppointment,
};
