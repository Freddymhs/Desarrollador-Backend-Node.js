import { Router } from "express";
import taskControllers from "@controllers/index";

const routes = Router();

routes.get("/tasks", taskControllers.getAllTasks);
routes.post("/tasks", taskControllers.createTask);
routes.put("/tasks/:id", taskControllers.updateTaskStatus);
routes.delete("/tasks/:id", taskControllers.deleteTask);

export default routes;
