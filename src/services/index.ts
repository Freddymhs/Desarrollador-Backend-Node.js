import { getDatabase } from "src/models/db";
import { Task } from "src/models/model";

export async function getAllTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.all<Task[]>("SELECT * FROM tasks");
}

//todo - se crea una nueva tarea (POST /tasks), servidor emite evento a todos los clientes conectados con la información de la nueva tarea. (ej. newTask, payload: la tarea creada).
export async function createTask(task: Task): Promise<number> {
  const db = await getDatabase();
  const result = await db.run(
    "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
    task.titulo,
    task.descripcion || null,
    task.status || "pendiente"
  );
  return result.lastID!;
}
//OPCIONAL// Cuando se elimina una tarea, emitir un evento para que los clientes la eliminen de su vista.
export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.run("DELETE FROM tasks WHERE id = ?", id);
}

//todo - si actualiza el estado de una tarea (PUT /tasks/:id), servidor emite evento a todos los clientes conectados con el ID de la tarea y su nuevo estado (ej. taskUpdated, payload: { id: tareaId, status: nuevoEstado }).
export async function updateTaskStatus(
  id: number,
  status: string
): Promise<void> {
  const db = await getDatabase();
  await db.run(`UPDATE tasks SET estado = ? WHERE id = ?`, [status, id]);
}

// .all() → para obtener múltiples filas.
// .get() → para una sola fila.
// .run() → para INSERT, UPDATE, DELETE.
