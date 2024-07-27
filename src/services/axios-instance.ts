import axios from "axios";
import { getAuth } from "firebase/auth";

import { apiBaseUrl } from "@/config";

// Create an axios instance
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

// Add a request interceptor to include the Firebase token
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
