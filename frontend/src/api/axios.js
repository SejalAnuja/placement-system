import axios from "axios";

const API = axios.create({
  baseURL: "srv-d3tftm75r7bs73epgci0/api",
  withCredentials: true,  // backend URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
