import { getDatabase } from "../database/db";
import { tasks } from "./constans";

async function seed() {
  const db = await getDatabase();
  console.log("Seed start================================");
  await db.run("DELETE FROM tasks");
  console.log("================deleted tasks================");
  const newTasks = tasks.map((t) => {
    return db.run(
      `INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)`,
      t.titulo,
      t.descripcion,
      t.status
    );
  });
  await Promise.all(newTasks);
  console.log("================New Tasks Created================");

  console.log("Seed End================================");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error en seed:", err);
  process.exit(1);
});

export default seed;
