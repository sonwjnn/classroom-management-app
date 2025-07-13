import z from "zod";
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registerSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const smsLoginSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  code: z.string().optional(),
});

export const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  code: z.string().optional(),
});

export const setupAccountSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
