import { getDatabase } from "src/database/db";
import {
  Task,
  TaskSchema,
  StatusSchema,
  idRequiredSchema,
} from "src/models/model";

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.all<Task[]>("SELECT * FROM tasks");
}

export async function createTask(task: Task): Promise<Task> {
  const db = await getDatabase();
  try {
    const parsed = TaskSchema.safeParse(task);
    if (!parsed.success)
      throw new Error("Error Schema invalido: " + parsed.error.message);

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
  } catch (error) {
    console.error("Error en createTask:", error);
    throw error;
  }
}

export async function deleteTask(id: number): Promise<void> {
  if (id <= 0) throw new Error("ID inválido: debe ser mayor que 0");

  const parsed = idRequiredSchema.safeParse(id);
  if (!parsed.success) throw new Error("ID inválido: " + parsed.error.message);

  const db = await getDatabase();
  await db.run("DELETE FROM tasks WHERE id = ?", parsed.data);
}

export async function updateTaskStatus(
  id: number,
  status: string
): Promise<void> {
  if (typeof id !== "number" || id <= 0 || Number.isNaN(id))
    throw new Error("ID inválido: debe ser un numero y positivo.");

  const db = await getDatabase();

  try {
    const parsed = StatusSchema.safeParse(status);
    if (!parsed.success) {
      throw new Error("Error Schema invalido: " + parsed.error.message);
    }

    await db.run(`UPDATE tasks SET status = ? WHERE id = ?`, [parsed.data, id]);
  } catch (error) {
    console.error("Error en updateTaskStatus:", error);
    throw error;
  }
}

const taskService = {
  getAllTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
};

export default taskService;

// todo add validations
