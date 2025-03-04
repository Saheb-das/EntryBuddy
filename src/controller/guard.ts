// external import
import createHttpError from "http-errors";

// internal imports
import guardService from "../service/guard";
import { today } from "../utils/date";

// types import
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authType";

interface IEventDate {
  year: string;
  month: string;
  day: string;
}

// get all appointments
async function getAllAppointments(
  req: AuthRequest<IEventDate>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { year, month, day } = req.body;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    let date: string;

    if (year && month && day) {
      date = `${day}-${month}-${year}`;
    } else {
      date = today();
    }

    const appointments = await guardService.getAllAppointments(date);
    if (!appointments) {
      throw createHttpError(404, "appointments not found");
    }

    if (appointments.length === 0) {
      res
        .status(200)
        .json({ success: true, message: "no appointment are requested" });
    }

    res.status(200).json({
      success: true,
      message: "no appointment are requested",
      appointments: appointments,
    });
  } catch (error) {
    next(error);
  }
}

// get a single appointment
async function getAppointment(
  req: AuthRequest<{}, { appointmentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { appointmentId } = req.params;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const appointment = await guardService.getAppointment(appointmentId);
    if (!appointment) {
      throw createHttpError(404, "there is no such appointment");
    }

    res.status(200).json({
      success: true,
      message: "appointment retieve successfully",
      appointment: appointment,
    });
  } catch (error) {
    next(error);
  }
}

// get permission of a single appointment
async function getPermission(
  req: AuthRequest<{ permissionOTP: number }, { appointmentId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { permissionOTP } = req.body;
  const { appointmentId } = req.params;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const permission = await guardService.getAppointmentPermission(
      appointmentId,
      permissionOTP
    );
    if (!permission) {
      res.status(200).json({ success: true, message: "permission deny" });
    }

    res.status(200).json({ success: true, message: "permission granted" });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  getAllAppointments,
  getAppointment,
  getPermission,
};
