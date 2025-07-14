export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN_SMS: `auth/sms-login`,
    LOGIN_EMAIL: `auth/email-login`,
    CURRENT_ROLE: `auth/get-role`,
    CURRENT_USER: `auth/current`,
  },
  STUDENT: {
    GET_STUDENTS: `students`,
    SETUP_ACCOUNT: `students/setup-account`,
    GET_LESSONS: `students/get-my-lessons`,
    MARK_LESSON_DONE: (id: string) => `students/mark-lesson-done/${id}`,
    GET_MY_INSTRUCTOR: `students/get-my-instructor`,
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
  CHAT: {
    GET_CONVERSATION_BY_USER_ID: (userTwoId: string) =>
      `chat/conversation/user/${userTwoId}`,
    GET_MESSAGES_BY_CONVERSATION_ID: (conversationId: string) =>
      `chat/messages/conversation/${conversationId}`,
    ADD_MESSAGE: `chat/messages/conversation`,
  },
} as const;
