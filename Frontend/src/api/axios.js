import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2000/api/v1/users",
  withCredentials: true, // cookies (JWT)
});

export default api;

