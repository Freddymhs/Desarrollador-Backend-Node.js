import { Request, Response, NextFunction } from "express";
import { AppError } from "@utils/errors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  res.status(500).json({
    error: "Error interno del servidor",
    statusCode: 500,
  });
};
