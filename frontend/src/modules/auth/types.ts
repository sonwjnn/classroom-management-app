export type SMSLoginResponse = {
  user?: User;
  accessToken?: string;
};

export type EmailLoginResponse = {
  user?: User;
  accessToken?: string;
};

export type SMSLoginRequest = {
  phone: string;
  code?: string;
};

export type EmailLoginRequest = {
  email: string;
  password: string;
  code?: string;
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
};

export type SetupAccountRequest = {
  token: string;
  email: string;
  name: string;
  phone: string;
  password: string;
};
