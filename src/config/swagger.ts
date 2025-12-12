import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateTaskSchema,
  DeleteTaskSchema,
  IdParamSchema,
  TaskSchema,
  UpdateTaskSchema,
} from "src/models/model";

const registry = new OpenAPIRegistry();

const basicInfo = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestión de Tareas",
    version: "1.0.0",
    description: "API REST para gestionar tareas con WebSocket en tiempo real",
  },
};

registry.register("CreateTask", CreateTaskSchema);
registry.register("Task", TaskSchema);
registry.register("UpdateTask", UpdateTaskSchema);
registry.register("DeleteTask", DeleteTaskSchema);

registry.registerPath({
  method: "get",
  path: "/tasks",
  summary: "Obtener todas las tareas",
  description: "Retorna una lista con todas las tareas existentes",
  tags: ["Tasks"],
  responses: {
    200: {
      description: "Lista de tareas obtenida exitosamente",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Task",
            },
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/tasks/{id}",
  summary: "Obtener una tarea por ID",
  description: "Retorna una tarea específica según su ID",
  tags: ["Tasks"],
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Tarea obtenida exitosamente",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});
// create
registry.registerPath({
  method: "post",
  path: "/tasks",
  summary: "Crear una nueva tarea",
  description:
    "Crea una nueva tarea. Solo requiere título, la descripción es opcional. El ID y status se generan automáticamente.",
  tags: ["Tasks"],
  requestBody: {
    required: true,
    description: "Datos para crear la tarea",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/CreateTask",
        },
      },
    },
  },
  responses: {
    201: {
      description: "Tarea creada exitosamente",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
    400: {
      description: "Datos inválidos",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
  },
});
// update
registry.registerPath({
  method: "put",
  path: "/tasks/{id}",
  summary: "Actualizar estado de una tarea",
  description: "Actualiza únicamente el estado de una tarea específica",
  tags: ["Tasks"],
  request: {
    params: IdParamSchema,
  },
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/UpdateTask",
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tarea actualizada exitosamente",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});
// delete
registry.registerPath({
  method: "delete",
  path: "/tasks/{id}",
  summary: "Eliminar una tarea",
  description: "Elimina permanentemente una tarea específica",
  tags: ["Tasks"],
  request: {
    params: IdParamSchema,
  },
  responses: {
    200: {
      description: "Tarea eliminada exitosamente",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Tarea eliminada exitosamente",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Tarea no encontrada",
    },
  },
});

export { registry, basicInfo };
