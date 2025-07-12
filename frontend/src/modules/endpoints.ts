export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN_SMS: `${API_BASE_URL}/auth/sms-login`,
    CURRENT_ROLE: `${API_BASE_URL}/auth/get-role`,
  },
  STUDENT: {
    GET_STUDENTS: `${API_BASE_URL}/students`,
  },
  INSTRUCTOR: {
    GET_STUDENTS: `${API_BASE_URL}/instructors/get-all-students`,
    CREATE_STUDENT: `${API_BASE_URL}/instructors/add-student`,
    DELETE_STUDENT: (phone: string) =>
      `${API_BASE_URL}/instructors/delete-student/${phone}`,
    UPDATE_STUDENT: (phone: string) =>
      `${API_BASE_URL}/instructors/edit-student/${phone}`,
  },
} as const;
