import { getDatabase } from "./db";

const db = await getDatabase();
// todo ws
// - La tabla de tareas debe tener al menos: id (PK, autoincremental), description (texto), status (texto, ej. "pendiente", "completada").
//  WebSockets (usando socket.io o ws):
await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL CHECK(length(titulo) <= 100),
      descripcion TEXT CHECK(length(descripcion) <= 500),
      status TEXT NOT NULL DEFAULT 'pendiente',
      fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

console.log("Migration completed");
