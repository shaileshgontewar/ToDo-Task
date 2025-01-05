import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3002`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = (data) => api.post("/auth/login", data);
export const registerApi = (data) => api.post("/auth/register", data);
export const getUserTasks = () => api.get("/task/user");
export const getUsersTask = (userId) => api.get(`/task/alltasks/${userId}`);
export const getUsers = () => api.get("/task/allusers");
export const createTask = (data) => api.post("/task", data);
export const updateTask = (id, data) => api.put(`/task/${id}`, data);
export const deleteTask = (id) => api.delete(`/task/${id}`);

export default api;
