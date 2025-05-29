import { Request, Response } from "express";
import taskService from "@services/index";
import { Server } from "socket.io";

const taskControllers = {
  getAllTasks: async (req: Request, res: Response) => {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  },

  createTask: async (req: Request, res: Response) => {
    const { titulo, descripcion } = req.body;
    const newTask = await taskService.createTask({
      titulo,
      descripcion,
      status: "pendiente",
    });

    (req as RequestWithIO).io.emit("newTask", newTask);
    res.status(201).json(newTask);
  },

  updateTaskStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await taskService.updateTaskStatus(Number(id), status);
    (req as RequestWithIO).io.emit("taskUpdated", { id: Number(id), status });
    res.json(updated);
  },

  deleteTask: async (req: Request, res: Response) => {
    const { id } = req.params;
    await taskService.deleteTask(Number(id));

    (req as RequestWithIO).io.emit("taskDeleted", { id: Number(id) });
    res.status(204).send();
  },
};

export default taskControllers;

export interface RequestWithIO extends Request {
  io: Server;
}
