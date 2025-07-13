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

export const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  assignedStudents: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        disable: z.boolean().optional(),
      })
    )
    .min(1, "At least one student must be assigned"),
});

export const updateLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  assignedStudents: z
    .array(z.object({ name: z.string(), phone: z.string(), email: z.string() }))
    .min(1, "At least one student must be assigned"),
});
