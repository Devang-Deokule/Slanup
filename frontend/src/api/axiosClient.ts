import axios from 'axios';

// Base URL - Update this to your deployed backend URL
// For local development, use: http://localhost:5000
// For production, use your Render/Railway backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// (No auth) Request interceptor removed since authentication is not used

// Response interceptor - returns the data directly
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Type helper for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export default axiosClient;

