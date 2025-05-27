import { SERVER_MESSAGES } from "@utils/constants";
import express, { Request, Response, NextFunction } from "express";
import setupMiddlewares from "@middleware/index";

const { unknownError } = SERVER_MESSAGES;

const app = express();
setupMiddlewares(app);

app.get("/", (_: Request, res: Response) => {
  res.send("hello mundo!!!");
});

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: unknownError });
});

export default app;
