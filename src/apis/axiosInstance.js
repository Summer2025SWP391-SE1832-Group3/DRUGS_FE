// src/apis/axiosInstance.js
import axios from "axios";
const apiBase = "https://api-drug-be.purintech.id.vn/api";


const axiosInstance = axios.create({
  baseURL: apiBase,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
