import { getDatabase } from "src/models/db";
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

//todo [WS]- se crea una nueva tarea (POST /tasks), servidor emite evento a todos los clientes conectados con la información de la nueva tarea. (ej. newTask, payload: la tarea creada).
export async function createTask(task: Task): Promise<number> {
  const db = await getDatabase();

  try {
    const parsed = TaskSchema.safeParse(task);
    if (!parsed.success)
      throw new Error("Error Schema invalido: " + parsed.error.message);

    const result = await db.run(
      "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
      parsed.data.titulo,
      parsed.data.descripcion || null,
      parsed.data.status || "pendiente"
    );
    return result.lastID!;
  } catch (error) {
    console.error("Error en createTask:", error);
    throw error;
  }
}

// todo [WS]//OPCIONAL// Cuando se elimina una tarea, emitir un evento para que los clientes la eliminen de su vista.

export async function deleteTask(id: number): Promise<void> {
  const parsed = idRequiredSchema.safeParse(id);
  if (!parsed.success) throw new Error("ID inválido: " + parsed.error.message);

  const db = await getDatabase();
  await db.run("DELETE FROM tasks WHERE id = ?", parsed.data);
}

//todo [WS] - si actualiza el estado de una tarea (PUT /tasks/:id), servidor emite evento a todos los clientes conectados con el ID de la tarea y su nuevo estado (ej. taskUpdated, payload: { id: tareaId, status: nuevoEstado }).
export async function updateTaskStatus(
  id: number,
  status: string
): Promise<void> {
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

// todo validaciones de datos
