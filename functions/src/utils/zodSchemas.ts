import { z } from "zod";

// Esquemas para validación de datos en Cloud Functions
// Los esquemas de booking han sido eliminados ya que el sistema de reservas fue reemplazado por WhatsApp

// Esquema para validación de usuarios
export const UserSchema = z.object({
  email: z.string().email("Invalid email format"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name too long"),
  role: z.enum(["admin", "manager", "staff", "customer", "student"]),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional(),
});

// Tipos inferidos para usar en TS
export type UserInput = z.infer<typeof UserSchema>;