import { getDatabase } from "src/database/db";
import {
  Task,
  TaskSchema,
  StatusSchema,
  idRequiredSchema,
} from "src/models/model";
import { NotFoundError, ValidationError } from "@utils/errors";

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.all<Task[]>("SELECT * FROM tasks");
}

export async function getTaskById(id: number): Promise<Task | null> {
  const parsed = idRequiredSchema.safeParse(id);
  if (!parsed.success) throw new ValidationError("ID inválido: " + parsed.error.message);

  const db = await getDatabase();
  const task = await db.get<Task>("SELECT * FROM tasks WHERE id = ?", parsed.data);
  return task || null;
}

export async function createTask(task: Task): Promise<Task> {
  const parsed = TaskSchema.safeParse(task);
  if (!parsed.success) {
    throw new ValidationError("Schema inválido: " + parsed.error.message);
  }

  const db = await getDatabase();
  const result = await db.run(
    "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
    parsed.data.titulo,
    parsed.data.descripcion || undefined,
    parsed.data.status || "pendiente"
  );

  return {
    id: result.lastID!,
    titulo: parsed.data.titulo,
    descripcion: parsed.data.descripcion || undefined,
    status: parsed.data.status || "pendiente",
  };
}

export async function deleteTask(id: number): Promise<void> {
  const parsed = idRequiredSchema.safeParse(id);
  if (!parsed.success) throw new ValidationError("ID inválido: " + parsed.error.message);
  if (id <= 0) throw new ValidationError("ID inválido: debe ser mayor que 0");

  const existing = await getTaskById(id);
  if (!existing) throw new NotFoundError("Tarea");

  const db = await getDatabase();
  await db.run("DELETE FROM tasks WHERE id = ?", parsed.data);
}

export async function updateTaskStatus(
  id: number,
  status: string
): Promise<Task> {
  if (typeof id !== "number" || id <= 0 || Number.isNaN(id)) {
    throw new ValidationError("ID inválido: debe ser un número positivo");
  }

  const parsedStatus = StatusSchema.safeParse(status);
  if (!parsedStatus.success) {
    throw new ValidationError("Status inválido: " + parsedStatus.error.message);
  }

  const existing = await getTaskById(id);
  if (!existing) throw new NotFoundError("Tarea");

  const db = await getDatabase();
  await db.run(
    "UPDATE tasks SET status = ?, fechaActualizacion = CURRENT_TIMESTAMP WHERE id = ?",
    [parsedStatus.data, id]
  );

  return { ...existing, status: parsedStatus.data };
}

const taskService = {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
  updateTaskStatus,
};

export default taskService;
