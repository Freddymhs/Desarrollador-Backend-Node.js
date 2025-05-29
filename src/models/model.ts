import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const TaskSchema = z.object({
  id: z.number().optional().openapi({ example: 1 }),
  titulo: z.string().max(100).openapi({ example: "Comprar pan" }),
  descripcion: z
    .string()
    .max(500)
    .optional()
    .openapi({ example: "Ir a la panadería a las 6 PM" }),
  status: z
    .enum(["pendiente", "completada"])
    .default("pendiente")
    .openapi({ example: "completada" }),
  fechaCreacion: z
    .string()
    .optional()
    .openapi({ example: "2025-05-28T12:00:00Z" }),
  fechaActualizacion: z
    .string()
    .optional()
    .openapi({ example: "2025-05-28T12:00:00Z" }),
});

export const StatusSchema = TaskSchema.shape.status;
export const idRequiredSchema = z.number().openapi({ example: 1 });

export type Task = z.infer<typeof TaskSchema>;
