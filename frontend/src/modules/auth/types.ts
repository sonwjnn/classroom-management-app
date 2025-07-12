export type LoginResponse = {
  phone?: string;
};

export type LoginRequest = {
  phone: string;
};

export type User = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "student" | "instructor";
  created_at: Date;
  updated_at: Date;
  password?: string;
  access_code: string;
  code_created_at: Date;
};
