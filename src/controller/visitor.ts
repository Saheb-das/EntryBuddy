// external import
import createHttpError from "http-errors";

// internal import
import visitorService from "../service/visitor";
import appointmentService from "../service/appointment";
import { appointmentSchema } from "../zod/appointment";
import { genVerifyToken } from "../utils/generateIdAndOTP";
import { visitorSchema } from "../zod/visitor";

// types import
import { Request, Response, NextFunction } from "express";
import { TVisitorInput } from "../types/userTypes";
import { TAppointmentInput } from "../types/appointmentType";
import { TAppointment } from "../model/appointment";

async function bookAppointment(
  req: Request<
    {},
    {},
    { visitorData: TVisitorInput; appointmentData: TAppointmentInput },
    { residentUserId: string }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { visitorData, appointmentData } = req.body;
  const { residentUserId } = req.query;

  try {
    if (typeof residentUserId !== "string") {
      throw createHttpError(400, "residentUserId must be a string");
    }

    const isValidVisitor = visitorSchema.safeParse(visitorData);
    if (!isValidVisitor.success) {
      throw createHttpError(400, "invalid visitor input");
    }

    const isValidAppointment = appointmentSchema.safeParse(appointmentData);
    if (!isValidAppointment.success) {
      throw createHttpError(400, "invalid appointment input");
    }

    // TODO: find resident user
    const residentUser = await visitorService.getResidentUserById(
      residentUserId
    );
    if (!residentUser) {
      throw createHttpError(404, "resident user not found");
    }

    // create temporary visitor ( if deny, it will deleted )
    const newVisitor = await visitorService.createVisitor(visitorData);
    if (!newVisitor) {
      throw createHttpError(500, "visitor not created");
    }

    const newOTP = Number(genVerifyToken());

    // create appointment payload
    const appointmentPayload: TAppointment = {
      resident: residentUser._id,
      visitor: newVisitor._id,
      purpose: appointmentData.purpose,
      timeSlot: appointmentData.timeSlot,
      eventDate: appointmentData.eventDate,
      permissionOTP: newOTP,
      verifyOTP: false,
    };
    // TODO: create temporary apointment.( if deny, it will deleted )
    const newAppointment = await appointmentService.createNewAppointment(
      appointmentPayload
    );
    if (!newAppointment) {
      throw createHttpError(500, "appointment not created");
    }

    const visitorName = `${newVisitor.firstName} ${newVisitor.lastName}`;

    // TODO: notify resident user via email
    await visitorService.sendMailToResident(
      residentUser.email,
      visitorName,
      newVisitor.phoneNo
    );
  } catch (error) {
    next(error);
  }
}

// export
export default {
  bookAppointment,
};
