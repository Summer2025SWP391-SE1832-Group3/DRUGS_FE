import axiosInstance from "./axiosInstance";

export const BlogStaffAPI = {
  create: (formData) =>
    axiosInstance.post("/Blog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
