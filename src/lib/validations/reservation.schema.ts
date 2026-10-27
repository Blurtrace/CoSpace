import { z } from "zod";

export const createReservationSchema = z
  .object({
    spaceId: z.string().uuid("El ID del espacio debe ser un UUID válido"),
    startTime: z
      .string()
      .datetime({ message: "La fecha y hora de inicio debe estar en formato ISO 8601" }),
    endTime: z
      .string()
      .datetime({ message: "La fecha y hora de finalización debe estar en formato ISO 8601" }),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    {
      message: "La hora de finalización debe ser posterior a la hora de inicio",
      path: ["endTime"],
    }
  );

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

