import { Request, Response, NextFunction } from "express";
import taskService from "@services/index";
import { Server } from "socket.io";
import { CreateTaskSchema, UpdateTaskSchema } from "src/models/model";
import { ValidationError } from "@utils/errors";

export interface RequestWithIO extends Request {
  io?: Server;
}

const emitEvent = (req: Request, event: string, data: unknown) => {
  const io = (req as RequestWithIO).io;
  if (io) io.emit(event, data);
};

const taskControllers = {
  getAllTasks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  },

  getTaskById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(Number(id));
      if (!task) {
        res.status(404).json({ error: "Tarea no encontrada" });
        return;
      }
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  createTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const newTask = await taskService.createTask({
        titulo: parsed.data.titulo,
        descripcion: parsed.data.descripcion,
        status: "pendiente",
      });

      emitEvent(req, "newTask", newTask);
      res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  },

  updateTaskStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const parsed = UpdateTaskSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const updated = await taskService.updateTaskStatus(Number(id), parsed.data.status);
      emitEvent(req, "taskUpdated", { id: Number(id), status: parsed.data.status });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  },

  deleteTask: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await taskService.deleteTask(Number(id));

      emitEvent(req, "taskDeleted", { id: Number(id) });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

export default taskControllers;
