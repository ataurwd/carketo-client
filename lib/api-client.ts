import axios from 'axios';
import { SITE_CONFIG } from './constants';

export const apiClient = axios.create({
  baseURL: SITE_CONFIG.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    // Check if token exists in localStorage (or rely on HttpOnly cookie)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data;
    let message = errorData?.message || error.message || 'Something went wrong';

    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      const fieldList = errorData.errors
        .map((e: any) => (e.field ? `${e.field}: ${e.message}` : e.message))
        .join(' • ');
      message = `${errorData.message || 'Validation failed'}: ${fieldList}`;
    }

    const customError: any = new Error(message);
    customError.errors = errorData?.errors;
    customError.statusCode = error.response?.status;
    return Promise.reject(customError);
  }
);
