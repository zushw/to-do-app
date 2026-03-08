import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_URL || '';
const finalUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

const api = axios.create({
  baseURL: finalUrl,
});

api.interceptors.request.use(
  (config) => {
    console.log(import.meta.env.VITE_API_URL)
    console.log(finalUrl)
    
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