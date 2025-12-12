import { getDatabase } from "src/database/db";
import taskService from "@services/index";
import { Task } from "src/models/model";

jest.mock("src/database/db", () => ({
  getDatabase: jest.fn(),
}));

const mockGetDatabase = getDatabase as jest.Mock;

describe("Task Services", () => {
  let mockDb: { run: jest.Mock; all: jest.Mock; get: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = { run: jest.fn(), all: jest.fn(), get: jest.fn() };
    mockGetDatabase.mockResolvedValue(mockDb);
  });

  describe("getAllTasks", () => {
    it("should return empty array when no tasks exist", async () => {
      mockDb.all.mockResolvedValue([]);

      const result = await taskService.getAllTasks();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return tasks with correct structure from the sqlite database", async () => {
      const mockTasks = [
        {
          id: 1,
          titulo: "Test Task",
          descripcion: "Test description",
          status: "pendiente",
          fechaCreacion: "2024-01-01T10:00:00Z",
          fechaActualizacion: "2024-01-01T10:00:00Z",
        },
        {
          id: 2,
          titulo: "Another Task",
          descripcion: null,
          status: "completada",
          fechaCreacion: "2024-01-02T11:00:00Z",
          fechaActualizacion: "2024-01-02T12:00:00Z",
        },
      ];
      mockDb.all.mockResolvedValue(mockTasks);

      const result = await taskService.getAllTasks();

      expect(result).toHaveLength(2);

      result.forEach((task) => {
        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("titulo");
        expect(task).toHaveProperty("descripcion");
        expect(task).toHaveProperty("status");
        expect(task).toHaveProperty("fechaCreacion");
        expect(task).toHaveProperty("fechaActualizacion");

        expect(typeof task.id).toBe("number");
        expect(typeof task.titulo).toBe("string");
        expect(typeof task.descripcion);
        expect(
          task.descripcion === null || typeof task.descripcion === "string"
        ).toBe(true);
        expect(typeof task.fechaCreacion).toBe("string");
        expect(typeof task.fechaActualizacion).toBe("string");
      });
    });
  });

  describe("getTaskById", () => {
    it("should return task when found", async () => {
      const mockTask = {
        id: 1,
        titulo: "Test Task",
        status: "pendiente",
      };
      mockDb.get.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1);

      expect(result).toEqual(mockTask);
    });

    it("should return null when task not found", async () => {
      mockDb.get.mockResolvedValue(undefined);

      const result = await taskService.getTaskById(999);

      expect(result).toBeNull();
    });
  });

  describe("updateTaskStatus", () => {
    it("should update and return task with new status", async () => {
      const existingTask = {
        id: 1,
        titulo: "Test Task",
        status: "pendiente",
      };
      mockDb.get.mockResolvedValue(existingTask);
      mockDb.run.mockResolvedValue({});

      const result = await taskService.updateTaskStatus(1, "completada");

      expect(result.status).toBe("completada");
    });

    it("should reject invalid ID values", async () => {
      await expect(
        taskService.updateTaskStatus(0, "pendiente")
      ).rejects.toThrow(/ID inválido/);
      await expect(
        taskService.updateTaskStatus(-5, "pendiente")
      ).rejects.toThrow(/ID inválido/);
      await expect(
        taskService.updateTaskStatus(NaN, "pendiente")
      ).rejects.toThrow(/ID inválido/);
    });

    it("should reject invalid status values", async () => {
      const existingTask = { id: 1, titulo: "Test", status: "pendiente" };
      mockDb.get.mockResolvedValue(existingTask);

      await expect(
        taskService.updateTaskStatus(1, "invalido")
      ).rejects.toThrow(/Status inválido/);
    });

    it("should throw NotFoundError when task does not exist", async () => {
      mockDb.get.mockResolvedValue(undefined);

      await expect(
        taskService.updateTaskStatus(999, "completada")
      ).rejects.toThrow(/no encontrado/);
    });
  });

  describe("deleteTask", () => {
    it("should reject invalid ID (negative number)", async () => {
      await expect(taskService.deleteTask(-1)).rejects.toThrow(/ID inválido/);
    });

    it("should reject invalid ID (zero)", async () => {
      await expect(taskService.deleteTask(0)).rejects.toThrow(/ID inválido/);
    });

    it("should throw NotFoundError when task does not exist", async () => {
      mockDb.get.mockResolvedValue(undefined);

      await expect(taskService.deleteTask(999)).rejects.toThrow(/no encontrado/);
    });

    it("should delete task when it exists", async () => {
      const existingTask = { id: 1, titulo: "Test", status: "pendiente" };
      mockDb.get.mockResolvedValue(existingTask);
      mockDb.run.mockResolvedValue({});

      await expect(taskService.deleteTask(1)).resolves.toBeUndefined();
      expect(mockDb.run).toHaveBeenCalled();
    });
  });

  describe("createTask", () => {
    it("should accept valid task", async () => {
      mockDb.run.mockResolvedValue({ lastID: 123 });

      const validTask: Task = {
        titulo: "Tarea válida",
        descripcion: "Descripción opcional",
        status: "pendiente",
      };

      const res = await taskService.createTask(validTask);

      expect(res).toEqual({
        id: 123,
        titulo: validTask.titulo,
        descripcion: validTask.descripcion,
        status: validTask.status,
      });

      expect(mockDb.run).toHaveBeenCalledWith(
        "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
        validTask.titulo,
        validTask.descripcion,
        validTask.status
      );
    });

    it("should reject invalid tasks according to schema", async () => {
      const invalidTask: any = {
        titulo: "",
        descripcion: "desc",
        status: "estado-invalido",
      };

      await expect(taskService.createTask(invalidTask)).rejects.toThrow(
        /Schema inválido/
      );
    });
  });
});
