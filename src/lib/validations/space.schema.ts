import { z } from "zod";

export const spaceTypeEnum = z.enum(["desk", "meeting_room", "private_office"], {
  errorMap: () => ({ message: "Tipo de espacio inválido (desk, meeting_room, private_office)" }),
});

export const createSpaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede exceder 150 caracteres"),
  description: z.string().trim().max(1000).optional().nullable(),
  type: spaceTypeEnum,
  pricePerHour: z
    .number({ invalid_type_error: "El precio por hora debe ser un número" })
    .positive("El precio por hora debe ser mayor a 0"),
  capacity: z
    .number({ invalid_type_error: "La capacidad debe ser un número entero" })
    .int("La capacidad debe ser un número entero")
    .min(1, "La capacidad mínima es de 1 persona")
    .max(100, "La capacidad máxima permitida es de 100 personas")
    .default(1),
  imageUrl: z
    .string()
    .trim()
    .url("La URL de la imagen no es válida")
    .max(500)
    .optional()
    .nullable(),
  isActive: z.boolean().default(true),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;

