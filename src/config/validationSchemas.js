// src/config/validationSchemas.js
import { z } from "zod";

// Schema para registro de usuario
export const registerSchema = z.object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(7, "DNI inválido").max(8, "DNI inválido"),
    phone: z.string().min(8, "Teléfono inválido"),
    birth_date: z.string().refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "Debes ser mayor de 18 años"),
    role: z.enum(['user']),
    newsletter_subscription: z.boolean(),
    status: z.enum(['active'])
  }).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  });

// Schema para login
export const loginSchema = z.object({
    email: z
      .string()
      .email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    remember_me: z
      .boolean()
      .optional()
  });

// Schema para dirección
export const addressSchema = z.object({
  alias: z
    .string()
    .min(2, "El alias debe tener al menos 2 caracteres"),
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  street: z
    .string()
    .min(3, "La calle debe tener al menos 3 caracteres"),
  number: z
    .string()
    .min(1, "El número es requerido"),
  apartment: z
    .string()
    .optional(),
  city: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres"),
  state: z
    .string()
    .min(2, "El estado debe tener al menos 2 caracteres"),
  postal_code: z
    .string()
    .min(4, "Código postal inválido")
    .max(5, "Código postal inválido"),
  country: z
    .string()
    .min(2, "El país debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .min(8, "Teléfono inválido"),
  is_default: z
    .boolean()
    .optional()
});

// Schema para actualización de usuario (admin panel)
export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede tener más de 50 caracteres")
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .optional(),
  role: z
    .enum(["user", "admin", "staff"], {
      errorMap: () => ({ message: "Rol inválido" })
    })
    .optional(),
  first_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  last_name: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  status: z
    .enum(["active", "inactive"], {
      errorMap: () => ({ message: "Estado inválido" })
    })
    .optional()
});

// Schema para creacion de usuario (admin panel)
export const userSchema = z.object({
    username: z
      .string()
      .min(3, "El username debe tener al menos 3 caracteres")
      .max(50, "El username no puede exceder los 50 caracteres"),
    email: z
      .string()
      .email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .optional(),
    role: z
      .enum(['user', 'staff', 'admin'], { 
        errorMap: () => ({ message: "Rol inválido" }) 
      }),
    first_name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z
      .string()
      .min(7, "DNI inválido")
      .max(8, "DNI inválido"),
    phone: z
      .string()
      .min(8, "Teléfono inválido"),
    birth_date: z
      .string()
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      }, "Debes ser mayor de 18 años"),
    newsletter_subscription: z
      .boolean(),
    preferences: z
      .object({}).optional()
  });

// Primero, agregar esto en src/config/validationSchemas.js
export const productSchema = z.object({
    name: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede exceder los 100 caracteres"),
    description: z
      .string()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder los 500 caracteres"),
    price: z
      .string()
      .min(1, "El precio es requerido")
      .refine((val) => !isNaN(val) && Number(val) > 0, "El precio debe ser mayor a 0"),
    category: z
      .string()
      .min(1, "La categoría es requerida"),
    brand: z
      .string()
      .min(1, "La marca es requerida"),
    style: z
      .string()
      .min(1, "El estilo es requerido"),
    era: z
      .string()
      .min(1, "La época es requerida"),
    size: z
      .string()
      .min(1, "La talla es requerida"),
    sex: z
      .string()
      .min(1, "El género es requerido"),
    color: z
      .string()
      .min(1, "El color es requerido"),
    material: z
      .string()
      .min(1, "El material es requerido"),
    image_url: z
      .string()
      .url("La URL de la imagen no es válida"),
    stock: z
      .string()
      .min(1, "El stock es requerido")
      .refine((val) => !isNaN(val) && Number(val) >= 0, "El stock debe ser un número válido"),
    serial_number: z
      .string()
      .min(1, "El numero de serie es requerido")
  });

  // Formulario de contacto
export const contactSchema = z.object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder los 50 caracteres"),
    email: z
      .string()
      .email("Email inválido"),
    subject: z
      .string()
      .min(3, "El asunto debe tener al menos 3 caracteres")
      .max(100, "El asunto no puede exceder los 100 caracteres"),
    message: z
      .string()
      .min(10, "El mensaje debe tener al menos 10 caracteres")
      .max(1000, "El mensaje no puede exceder los 1000 caracteres")
  });

// Edit personal info
export const personalInfoSchema = z.object({
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(7, "DNI inválido").max(8, "DNI inválido"),
    phone: z.string().min(8, "Teléfono inválido").optional().or(z.literal(''))
  });

// Edit password
export const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string()
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
});

// Delete user
export const deleteAccountSchema = z.object({
    password: z.string().min(1, "La contraseña es requerida"),
    confirmDelete: z.literal(true, {
        errorMap: () => ({ message: "Debes confirmar que quieres eliminar tu cuenta" })
    })
});

// Función helper para formatear errores de Zod
export const formatZodErrors = (error) => {
  const formattedErrors = {};
  error.errors.forEach((err) => {
    formattedErrors[err.path[0]] = err.message;
  });
  return formattedErrors;
};