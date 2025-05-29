import { Express } from "express";
import tasksRoutes from "./tasks";
import rootRoutes from "./root";
import swaggerRoute from "./swagger";

export default function setupRoutes(app: Express) {
  app.use(tasksRoutes);
  app.use(rootRoutes);
  app.use(swaggerRoute);
}
