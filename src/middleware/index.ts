import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config from "@config/index";
import { Express } from "express";

const setupMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan(config.morganFormat));
  app.use(express.urlencoded(config.urlencoded));
};

export default setupMiddlewares;
