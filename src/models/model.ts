import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number().optional(),
  titulo: z.string(),
  descripcion: z.string().optional(),
  status: z.string().optional(),
  fechaCreacion: z.string().optional(),
  fechaActualizacion: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
