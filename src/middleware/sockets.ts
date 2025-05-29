import { RequestWithIO } from "@controllers/index";
import { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";

export const injectSocketIO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (req as RequestWithIO).io = req.app.locals.io as Server;
  next();
};
