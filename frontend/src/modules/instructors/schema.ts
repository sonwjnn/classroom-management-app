import z from "zod";
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

export const createStudentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

export const updateStudentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  newPhone: z.string().regex(phoneRegex, "Invalid phone number"),
});
