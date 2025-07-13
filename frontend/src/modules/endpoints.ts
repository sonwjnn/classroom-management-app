export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN_SMS: `auth/sms-login`,
    LOGIN_EMAIL: `auth/email-login`,
    CURRENT_ROLE: `auth/get-role`,
  },
  STUDENT: {
    GET_STUDENTS: `students`,
    GET_PROFILE_BY_EMAIL: `students/get-profile-by-email`,
    SETUP_ACCOUNT: `students/setup-account`,
  },
  INSTRUCTOR: {
    GET_STUDENTS: `instructors/get-all-students`,
    CREATE_STUDENT: `instructors/add-student`,
    DELETE_STUDENT: (phone: string) => `instructors/delete-student/${phone}`,
    UPDATE_STUDENT: (phone: string) => `instructors/edit-student/${phone}`,
    GET_LESSONS: `instructors/my-lessons`,
    CREATE_LESSON: `instructors/assign-lesson`,
    DELETE_LESSON: (id: string) => `instructors/delete-lesson/${id}`,
    UPDATE_LESSON: (id: string) => `instructors/edit-lesson/${id}`,
  },
} as const;
