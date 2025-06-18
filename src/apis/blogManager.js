
import axiosInstance from "./axiosInstance"; // ✅ Đúng

export const BlogManagerAPI = {
  getAll: () => axiosInstance.get("/Blog/allBlogs"),
  update: (id, data) => axiosInstance.put(`/Blog/${id}`, data),
  delete: (id) => axiosInstance.delete(`/Blog/${id}`),
  approve: (id) => axiosInstance.post(`/Blog/approve/${id}`),
  reject: (id) => axiosInstance.post(`/Blog/reject/${id}`),
};
