// external import
import createHttpError from "http-errors";

// internal import
import { visitorSchema } from "../zod/visitor";
import { appointmentSchema } from "../zod/appointment";
import appointmentService from "../service/appointment";
import { convertToObjectId } from "../lib/convertIdType";

// types import
import { Types } from "mongoose";
import { NextFunction, Response, Request } from "express";
import { TVisitorInput } from "../types/userTypes";
import { TAppointmentInput } from "../types/appointmentType";
import { AuthRequest } from "../types/authType";

// create new appointment
async function createAppointment(
  req: Request<
    {},
    {},
    {
      visitorData: TVisitorInput;
      appointmentData: TAppointmentInput;
      societyId: string | Types.ObjectId;
    },
    { userId: string | Types.ObjectId }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { visitorData, appointmentData, societyId } = req.body;
  const { userId } = req.query;

  try {
    if (!userId) {
      throw createHttpError(400, "resident id required");
    }

    const isValidVisitor = visitorSchema.safeParse(visitorData);
    if (!isValidVisitor.success) {
      throw createHttpError(400, "invalid visitor input");
    }

    const isValidAppointment = appointmentSchema.safeParse(appointmentData);
    if (!isValidAppointment.success) {
      throw createHttpError(400, "invalid appointment input");
    }

    const newAppointment = await appointmentService.makeAppointment(
      isValidVisitor.data,
      isValidAppointment.data,
      convertToObjectId(userId),
      convertToObjectId(societyId)
    );
    if (!newAppointment) {
      throw createHttpError(500, "Appointment is not created");
    }

    res.status(200).json({
      success: true,
      message: "appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    next(error);
  }
}

async function getAppointment(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.authUser) {
      throw createHttpError(400, "unauthorized user");
    }
  } catch (error) {
    next(error);
  }
}

async function getRequestAppointments(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.authUser) {
      throw createHttpError(400, "unauthorized user");
    }

    const societyId = req.authUser.societyId;
    const userId = req.authUser._id;

    const appointments = await appointmentService.getAppointmentsByUserId(
      userId,
      societyId
    );
    if (!appointments) {
      throw createHttpError(404, "appointments are not found");
    }

    res.status(200).json({
      success: true,
      message: "appointments fetch successfully",
      appoointments: appointments,
    });
  } catch (error) {
    next(error);
  }
}

async function confirmAppointment(
  req: AuthRequest<{ appointmentId: string | Types.ObjectId }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { appointmentId } = req.body;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized user");
    }

    const userId = req.authUser._id;

    const confirmedAppointment = await appointmentService.confirmAppointment(
      appointmentId,
      userId
    );
    if (!confirmedAppointment) {
      throw createHttpError(500, "not confirming appointment");
    }

    res.status(200).json({
      success: true,
      message: "appointment confirm successfully",
      appoointment: confirmedAppointment,
    });
  } catch (error) {
    next(error);
  }
}

async function denyAppointment(
  req: AuthRequest<{ appointmentId: string | Types.ObjectId }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { appointmentId } = req.body;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized user");
    }

    const deniedAppointment = await appointmentService.deleteAppointment(
      appointmentId
    );
    if (!deniedAppointment) {
      throw createHttpError(500, "deny appointment failed");
    }

    res.status(200).json({
      success: true,
      message: "requested appointment delete successfully",
      appoointment: deniedAppointment,
    });
  } catch (error) {
    next(error);
  }
}

async function getAppointmentByDate(): Promise<void> {}

async function deleteAppointment(): Promise<void> {}

// export
export default {
  createAppointment,
  getAppointment,
  getAppointmentByDate,
  getRequestAppointments,
  confirmAppointment,
  denyAppointment,
  deleteAppointment,
};
