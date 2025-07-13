export type Student = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "student" | "instructor";
  created_at: Date;
  updated_at: Date;
  password?: string;
  status: "active" | "inactive";
};

export type GetStudentsResponse = {
  data: Student[];
};

export type GetStudentsRequest = {
  phone: string;
};

export type CreateStudentRequest = {
  name: string;
  email: string;
  phone: string;
};

export type UpdateStudentRequest = {
  name?: string;
  email?: string;
  phone?: string;
};

export interface Lesson {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  assigned_students?: StudentLesson[];
}

export interface StudentLesson {
  id: string;
  lesson_id: string;
  student_id: string;
  student_phone: string;
  student_email: string;
  student_name: string;
  status: "assigned" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export type CreateLessonRequest = {
  title: string;
  description: string;
  assignedStudents: {
    id: string;
    name: string;
    phone: string;
    email: string;
  }[];
};

export type UpdateLessonRequest = {
  title?: string;
  description?: string;
  assignedStudents?: {
    id: string;
    lesson_id: string;
    student_id: string;
    name: string;
    phone: string;
    email: string;
  }[];
};
