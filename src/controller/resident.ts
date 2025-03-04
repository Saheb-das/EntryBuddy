// external imports
import createHttpError from "http-errors";

// internal imports
import residentService from "../service/resident";

// types import
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/authType";

// get all appointments
async function getAllAppointments(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const residentId = req.authUser.profileId;

    // get all appointments
    const appointments = await residentService.getAllAppointments(residentId);
    if (!appointments) {
      throw createHttpError(404, "appointments are not found");
    }

    // response back
    if (appointments.length === 0) {
      res
        .status(200)
        .json({ success: true, message: "there are no appointments yet" });
    }

    res.status(200).json({
      success: true,
      message: "appointments retrive successfully",
      appointments: appointments,
    });
  } catch (error) {
    next(error);
  }
}

// get a user's appointment
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

    const residentUserId = req.authUser._id;

    const appointment = await residentService.getAppointment(
      residentUserId,
      appointmentId
    );
    if (!appointment) {
      throw createHttpError(404, "appointment not found");
    }

    res.status(200).json({
      success: true,
      message: "appointment retrive successfull",
      appointment: appointment,
    });
  } catch (error) {
    next(error);
  }
}

export interface IEditUser {
  email?: string;
  phoneNo?: string;
  occupation?: string;
}

// update resident user's profile [ email, phone-number, occupation ]
async function updatesUserProfile(
  req: AuthRequest<IEditUser>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { email, phoneNo, occupation } = req.body;
  try {
    if (!email && !phoneNo && !occupation) {
      res.status(400).json({ message: "No valid fields to update" });
    }

    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const userId = req.authUser._id;
    const editableData: { [key in keyof IEditUser]: string } = {};

    if (email) {
      editableData.email = email;
    }
    if (phoneNo) {
      editableData.phoneNo = phoneNo;
    }
    if (occupation) {
      editableData.occupation = occupation;
    }

    const isUpdatedUser = await residentService.updatesUserProfile(
      userId,
      editableData
    );
    if (!isUpdatedUser) {
      throw createHttpError(500, "user updation failed");
    }

    res.status(200).json({
      success: true,
      message: "user updated successfull",
      updated_user: isUpdatedUser,
    });
  } catch (error) {
    next(error);
  }
}

type TConfirm = "ACCEPT" | "DENY";

// resident will confirm appointment
async function isConfirmAppointment(
  req: AuthRequest<{ isConfirm: TConfirm }, { appointmentId: string }>,
  res: Response,
  next: NextFunction
) {
  const { isConfirm } = req.body;
  const { appointmentId } = req.params;

  try {
    if (isConfirm === "ACCEPT") {
      await residentService.confirmAppointment(appointmentId);
    } else if (isConfirm === "DENY") {
      await residentService.denyAppointment(appointmentId);
    } else {
      throw createHttpError(400, "invalid input confirm");
    }

    res.status(200).json({ success: true, message: "successfull" });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  getAllAppointments,
  getAppointment,
  updatesUserProfile,
  isConfirmAppointment,
};
