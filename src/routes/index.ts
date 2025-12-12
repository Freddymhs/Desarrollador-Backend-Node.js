import { Express } from "express";
import tasksRoutes from "./tasks";
import rootRoutes from "./root";
import swaggerRoute from "./swagger";
import { errorHandler } from "@middleware/errorHandler";

export default function setupRoutes(app: Express) {
  app.use(rootRoutes);
  app.use(tasksRoutes);
  app.use(swaggerRoute);
  app.use(errorHandler);
}
