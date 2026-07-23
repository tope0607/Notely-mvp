import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} failed`, err);
  }

  res.status(statusCode).json({ error: err.message });
}
