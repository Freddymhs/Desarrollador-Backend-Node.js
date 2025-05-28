import { getDatabase } from "src/models/db";
import taskService from "@services/index";
import { Task } from "src/models/model";

jest.mock("src/models/db", () => ({
  getDatabase: jest.fn(),
}));

const mockGetDatabase = getDatabase as jest.Mock;

describe("Task Services", () => {
  let mockDb: { run: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = { run: jest.fn() };
    mockGetDatabase.mockResolvedValue(mockDb);
  });

  describe("getAllTasks", () => {
    let mockDb: { all: jest.Mock };

    beforeEach(() => {
      jest.clearAllMocks();
      mockDb = { all: jest.fn() };
      mockGetDatabase.mockResolvedValue(mockDb);
    });

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

  describe("updateTaskStatus", () => {
    it("should accept 'pendiente' and 'completada' as valid statuses", async () => {
      await expect(
        taskService.updateTaskStatus(1, "pendiente")
      ).resolves.toBeUndefined();
      await expect(
        taskService.updateTaskStatus(1, "completada")
      ).resolves.toBeUndefined();
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
  });

  describe("deleteTask", () => {
    it("should reject invalid ID (negative number)", async () => {
      await expect(taskService.deleteTask(-1)).rejects.toThrow("ID inválido:");
    });

    it("should reject invalid ID (zero)", async () => {
      await expect(taskService.deleteTask(0)).rejects.toThrow("ID inválido:");
    });
  });

  describe("createTask", () => {
    it("should accept valid task and return a number (new ID)", async () => {
      mockDb.run.mockResolvedValue({ lastID: 123 });

      const validTask: Task = {
        titulo: "Tarea válida",
        descripcion: "Descripción opcional",
        status: "pendiente",
      };

      const id = await taskService.createTask(validTask);
      expect(typeof id).toBe("number");
      expect(id).toBe(123);

      expect(mockDb.run).toHaveBeenCalledWith(
        "INSERT INTO tasks (titulo, descripcion, status) VALUES (?, ?, ?)",
        validTask.titulo,
        validTask.descripcion,
        validTask.status
      );
    });

    it("should reject invalid tasks according to schema", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const invalidTask: any = {
        titulo: "",
        descripcion: "desc",
        status: "estado-invalido",
      };

      await expect(taskService.createTask(invalidTask)).rejects.toThrow(
        /Error Schema invalido/
      );

      consoleSpy.mockRestore();
    });
  });
});
