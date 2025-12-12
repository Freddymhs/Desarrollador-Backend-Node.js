import request from "supertest";
import app from "@app";
import { getDatabase } from "src/database/db";

describe("API Integration Tests", () => {
  beforeAll(async () => {
    const db = await getDatabase();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL CHECK(length(titulo) <= 100),
        descripcion TEXT CHECK(length(descripcion) <= 500),
        status TEXT NOT NULL DEFAULT 'pendiente',
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });

  beforeEach(async () => {
    const db = await getDatabase();
    await db.exec("DELETE FROM tasks");
  });

  describe("GET /tasks", () => {
    it("should return empty array when no tasks exist", async () => {
      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("should return all tasks", async () => {
      const db = await getDatabase();
      await db.run(
        "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
        "Test Task",
        "Description",
        "pendiente"
      );

      const response = await request(app).get("/tasks");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].titulo).toBe("Test Task");
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        titulo: "Nueva tarea",
        descripcion: "Descripción de la tarea",
      };

      const response = await request(app)
        .post("/tasks")
        .send(newTask)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.titulo).toBe(newTask.titulo);
      expect(response.body.status).toBe("pendiente");
    });

    it("should return 400 when titulo is missing", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ descripcion: "Solo descripcion" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should create task without descripcion", async () => {
      const response = await request(app)
        .post("/tasks")
        .send({ titulo: "Solo titulo" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body.titulo).toBe("Solo titulo");
    });
  });

  describe("GET /tasks/:id", () => {
    it("should return a task by id", async () => {
      const db = await getDatabase();
      const result = await db.run(
        "INSERT INTO tasks (titulo, status) VALUES (?, ?)",
        "Task to find",
        "pendiente"
      );

      const response = await request(app).get(`/tasks/${result.lastID}`);

      expect(response.status).toBe(200);
      expect(response.body.titulo).toBe("Task to find");
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).get("/tasks/99999");

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update task status", async () => {
      const db = await getDatabase();
      const result = await db.run(
        "INSERT INTO tasks (titulo, status) VALUES (?, ?)",
        "Task to update",
        "pendiente"
      );

      const response = await request(app)
        .put(`/tasks/${result.lastID}`)
        .send({ status: "completada" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("completada");
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app)
        .put("/tasks/99999")
        .send({ status: "completada" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
    });

    it("should return 400 for invalid status", async () => {
      const db = await getDatabase();
      const result = await db.run(
        "INSERT INTO tasks (titulo, status) VALUES (?, ?)",
        "Task",
        "pendiente"
      );

      const response = await request(app)
        .put(`/tasks/${result.lastID}`)
        .send({ status: "invalido" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const db = await getDatabase();
      const result = await db.run(
        "INSERT INTO tasks (titulo, status) VALUES (?, ?)",
        "Task to delete",
        "pendiente"
      );

      const response = await request(app).delete(`/tasks/${result.lastID}`);

      expect(response.status).toBe(204);

      const deleted = await db.get(
        "SELECT * FROM tasks WHERE id = ?",
        result.lastID
      );
      expect(deleted).toBeUndefined();
    });

    it("should return 404 for non-existent task", async () => {
      const response = await request(app).delete("/tasks/99999");

      expect(response.status).toBe(404);
    });
  });
});
