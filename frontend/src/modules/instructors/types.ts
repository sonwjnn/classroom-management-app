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
