import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().optional(),
  titulo: z.string().max(100),
  descripcion: z.string().max(500).optional(),
  status: z.enum(["pendiente", "completada"]).default("pendiente"),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
});

export const StatusSchema = TaskSchema.shape.status;
export const idRequiredSchema = z.number();

export type Task = z.infer<typeof TaskSchema>;
