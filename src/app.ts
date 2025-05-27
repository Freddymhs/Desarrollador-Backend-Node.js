import express, { Request, Response, NextFunction } from "express";
import setupMiddlewares from "./middleware";
import { SERVER_MESSAGES } from "./utils/constants";

const app = express();

setupMiddlewares(app);

app.get("/", (_: Request, res: Response) => {
  res.send("hello mundo!!!");
});

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: SERVER_MESSAGES.unknownError });
});

export default app;
