import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.BACK_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@ToDoApp:token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;