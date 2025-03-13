// external import
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

// internal import
import societyService from "../service/society";

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

// export
export default {
  getAllSociety,
};
