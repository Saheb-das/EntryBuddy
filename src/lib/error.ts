// external import
import { Request, Response, NextFunction } from "express";
import createHttpError, { isHttpError } from "http-errors";

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

// no-match route
export function noMatchRoute(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(createHttpError(404, "Invalid path url"));
}
