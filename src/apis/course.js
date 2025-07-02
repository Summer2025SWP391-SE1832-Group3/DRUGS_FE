import axiosInstance from './axiosInstance';

export const postCourse = async (data) => {
  // data: { title, description, topic }
  return axiosInstance.post('/Course', data);
};

export const getAllCourses = async () => {
  return axiosInstance.get('/Course/all');
};

export const updateCourse = async (courseId, data) => {
  // data: { title, description, topic }
  return axiosInstance.put(`/Course/${courseId}`, data);
};

export const deleteCourse = async (courseId) => {
  return axiosInstance.delete(`/Course/${courseId}`);
}; 