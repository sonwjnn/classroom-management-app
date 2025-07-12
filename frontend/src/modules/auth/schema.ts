import z from "zod";
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const registerSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const loginSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
  code: z.string().optional(),
});
