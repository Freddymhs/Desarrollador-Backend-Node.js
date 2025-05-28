import { Request, Response } from "express";
import taskService from "@services/index";

export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAllTasks();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const { titulo, descripcion } = req.body;
  const newTask = await taskService.createTask({
    titulo,
    descripcion,
    status: "pendiente",
  });
  res.status(201).json(newTask);
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await taskService.updateTaskStatus(Number(id), status);
  res.json(updated);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await taskService.deleteTask(Number(id));
  res.status(204).send();
};

const taskControllers = {
  getAllTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
};

export default taskControllers;
