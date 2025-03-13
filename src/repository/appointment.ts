// internal import
import Appointment from "../model/appointment";

// types import
import { HydratedDocument, Types } from "mongoose";
import { TAppointment, AppointmentType } from "../model/appointment";

async function findAll() {}

async function findById(
  id: Types.ObjectId
): Promise<HydratedDocument<AppointmentType> | null> {
  const appointment = await Appointment.findById(id).exec();
  return appointment;
}

async function findByUserId(
  userId: Types.ObjectId,
  societyId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const appointments = await Appointment.find({
    resident: userId,
    society: societyId,
  }).exec();

  return appointments;
}

async function findByExectDate(
  dateISO: Date,
  societyId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const appointments = await Appointment.find({
    society: societyId,
    eventDate: {
      $gte: dateISO,
      $lt: new Date(dateISO.getTime() + 86400000), // Add 1 day
    },
  }).exec();

  return appointments;
}

async function findByDateRange(
  startDateISO: Date,
  endDateISO: Date,
  societyId: Types.ObjectId
): Promise<HydratedDocument<AppointmentType>[] | null> {
  const appointments = await Appointment.find({
    society: societyId,
    eventDate: { $gte: startDateISO, $lte: endDateISO },
  }).exec();

  return appointments;
}

async function create(
  data: TAppointment
): Promise<HydratedDocument<AppointmentType>> {
  const newAppointment = new Appointment(data);
  return await newAppointment.save();
}

async function update(
  id: Types.ObjectId,
  field: keyof AppointmentType,
  value: any
): Promise<HydratedDocument<AppointmentType> | null> {
  try {
    const updatedApp = await Appointment.findByIdAndUpdate(
      id,
      { [field]: value },
      { new: true }
    ).exec();
    return updatedApp;
  } catch (error) {
    console.log("Error updating appointment");
    return null;
  }
}

async function remove(
  id: Types.ObjectId
): Promise<HydratedDocument<AppointmentType> | null> {
  const delAppointment = await Appointment.findByIdAndDelete({
    _id: id,
  }).exec();
  return delAppointment;
}

// export
export default {
  findAll,
  findById,
  findByUserId,
  findByExectDate,
  findByDateRange,
  create,
  update,
  remove,
};
