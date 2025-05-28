import { getDatabase } from "./db";

const db = await getDatabase();
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
