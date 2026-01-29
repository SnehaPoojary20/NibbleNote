import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // cookies (JWT)
});

export default api;

