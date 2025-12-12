import { Router } from "express";
import taskControllers from "@controllers/index";
import { injectSocketIO } from "@middleware/sockets";

const routes = Router();

routes.use(injectSocketIO);

routes.get("/tasks", taskControllers.getAllTasks);
routes.get("/tasks/:id", taskControllers.getTaskById);
routes.post("/tasks", taskControllers.createTask);
routes.put("/tasks/:id", taskControllers.updateTaskStatus);
routes.delete("/tasks/:id", taskControllers.deleteTask);

export default routes;
