import { TOKEN_NAME } from "@/constants";
import { API_BASE_URL } from "@/modules/endpoints";
import axios from "axios";

const privateClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

privateClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_NAME);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

privateClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error?.response?.data);
    }

    if (error.request) {
      return Promise.reject({
        statusCode: 500,
        message:
          "No response received from the server. Please check your internet connection.",
      });
    }

    return Promise.reject({
      statusCode: 500,
      message: error.message || "Something went wrong!",
    });
  }
);

export default privateClient;
