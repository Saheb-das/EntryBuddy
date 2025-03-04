// external imports
import createHttpError from "http-errors";

// internal imports
import adminService from "../service/admin";

// types import
import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authType";
import { userSchema } from "../zod/user";
import { TUserInput } from "../types/userTypes";

// create resident or guard by admin based on role
async function createUserByAdmin(
  req: AuthRequest<TUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userData = req.body;

  try {
    if (!req.authUser) {
      throw createHttpError(401, "only authorized user can access this route");
    }

    // check validation resident user through userSchema ( zod schema )
    const isValidData = userSchema.safeParse(userData);
    if (!isValidData.success) {
      throw createHttpError(400, "invalid data");
    }

    // create new resident user
    const newUser = await adminService.createUserByAdmin(userData);
    if (!newUser) {
      throw createHttpError(400, "user not created by admin");
    }

    // profile id of admin user
    const adminProfileId = req.authUser.profileId;

    // update admin with new created user's id
    const updatedAdmin = await adminService.updateAdminWithUserId(
      adminProfileId,
      newUser.role,
      newUser._id
    );
    if (!updatedAdmin) {
      throw createHttpError(400, "admin updation failed");
    }

    // response back
    res.status(200).json({
      success: true,
      message: `${newUser.role} user created`,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
}

// get resident by id
async function getResident(
  req: AuthRequest<{}, { residentUserId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { residentUserId } = req.params;

  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const residentUser = await adminService.getResident(residentUserId);
    if (!residentUser) {
      throw createHttpError(404, "resident user not found");
    }

    res.status(200).json({
      success: true,
      message: "resident user retrive successfully",
      resident: residentUser,
    });
  } catch (error) {
    next(error);
  }
}

// get all resident user
async function getAllResidents(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const residents = await adminService.getAllResidents();
    if (!residents) {
      throw createHttpError(404, "residents not exists");
    }

    res.status(200).json({
      success: true,
      message: "residents retrive successfully",
      residents: residents,
    });
  } catch (error) {
    next(error);
  }
}

//get a single guard by id
async function getGuard(
  req: AuthRequest<{}, { guardId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { guardId } = req.params;
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const guard = await adminService.getGuard(guardId);
    if (!guard) {
      throw createHttpError(404, "guard user not found");
    }

    res.status(200).json({
      success: true,
      message: "guard user retrive succcessfully",
      guard: guard,
    });
  } catch (error) {
    next(error);
  }
}

// get all guard users
async function getAllGuards(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.authUser) {
      throw createHttpError(401, "unauthorized");
    }

    const guards = await adminService.getAllGuards();
    if (!guards) {
      throw createHttpError(404, "guards are not found");
    }

    res.status(200).json({
      success: true,
      message: "guards user retrive successfully",
      guards: guards,
    });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  createUserByAdmin,
  getAllGuards,
  getGuard,
  getAllResidents,
  getResident,
};
