// external import
import createHttpError from "http-errors";

// internal import
import societyService from "../service/society";

// types import
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

async function getAllSociety(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const societies = await societyService.getAllSociety();
    if (!societies) {
      throw createHttpError(404, "society not found");
    }

    res.status(200).json({
      success: true,
      message: "society fetched successfully",
      societies: societies,
    });
  } catch (error) {
    next(error);
  }
}

async function getSociety(
  req: Request<{ id: string | Types.ObjectId }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { id } = req.params;

  try {
    const society = await societyService.getSocietyById(id);
    if (!society) {
      throw createHttpError(404, "society not found");
    }

    res.status(200).json({
      success: true,
      message: "society fetched successfully",
      society: society,
    });
  } catch (error) {
    next(error);
  }
}

async function getAllUsersByRole(
  req: Request<
    { id: string | Types.ObjectId },
    {},
    {},
    { role: "admin" | "resident" | "guard" }
  >,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { role } = req.query;
  const { id } = req.params;

  try {
    const users = await societyService.getAllUserByRole(id, role);
    if (!users) {
      throw createHttpError(404, "users not found");
    }

    res.status(200).json({
      success: true,
      message: "users fetched successfully",
      users: users,
    });
  } catch (error) {
    next(error);
  }
}

// export
export default {
  getAllSociety,
  getSociety,
  getAllUsersByRole,
};
