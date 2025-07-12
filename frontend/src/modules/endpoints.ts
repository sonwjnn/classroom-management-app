export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const APP_URL = import.meta.env.VITE_APP_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN_SMS: `${API_BASE_URL}/auth/sms-login`,
  },
  USER: {},
} as const;
