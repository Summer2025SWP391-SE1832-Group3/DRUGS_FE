import axios from "axios";
const apiBase = "https://localhost:7045/api";

export const BlogManagerAPI = {
  getAll: () => axios.get(`${apiBase}/Blog/Manager`),
  update: (id, data) => axios.put(`${apiBase}/Blog/${id}`, data),
  delete: (id) => axios.delete(`${apiBase}/Blog/${id}`),
  approve: (id) => axios.post(`${apiBase}/Blog/approve/${id}`),
  reject: (id) => axios.post(`${apiBase}/Blog/reject/${id}`),
};
