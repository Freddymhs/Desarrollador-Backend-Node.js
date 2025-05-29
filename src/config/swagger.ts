import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { TaskSchema } from "src/models/model";
import { SERVER_MESSAGES } from "@utils/constants";

const registry = new OpenAPIRegistry();
const basicInfo = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestión de Tareas",
    version: "1.0.0",
  },
  // servers: [
  //   {
  //     url: `http://${process.env.HOST || "localhost"}:${
  //       process.env.PORT || 3000
  //     }`,
  //   },
  // ],
};

registry.register("Task", TaskSchema);
registry.registerPath({
  method: "get",
  path: "/tasks",
  summary: "Obtener todas las tareas",
  responses: {
    200: {
      description: "Lista de tareas",
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
  method: "post",
  path: "/tasks",
  summary: "Crear una nueva tarea",
  request: {
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Tarea creada",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
  },
});
registry.registerPath({
  method: "put",
  path: "/tasks/{id}",
  summary: "Actualizar estado de tarea",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Tarea actualizada",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Task",
          },
        },
      },
    },
  },
});
registry.registerPath({
  method: "delete",
  path: "/tasks/{id}",
  summary: "Eliminar tarea",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: "Tarea eliminada",
    },
  },
});
registry.registerPath({
  method: "get",
  path: "/",
  summary: "root path",
  responses: {
    200: {
      description: SERVER_MESSAGES.apiIsRunning,
      content: {
        "text/plain": {
          schema: {
            type: "string",
          },
        },
      },
    },
  },
});

export { registry, basicInfo };
