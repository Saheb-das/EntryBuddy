// external import
import createHttpError, { isHttpError } from "http-errors";
import { Response, Request, NextFunction } from "express";

// global error handler
export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let errMsg = "Internal server error";

  if (isHttpError(err)) {
    statusCode = err.status;
    errMsg = err.message;
  }

  res.status(statusCode).json({ error: errMsg });
}

export function noMatchRoute(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(createHttpError(400, "Invalid path url"));
}
