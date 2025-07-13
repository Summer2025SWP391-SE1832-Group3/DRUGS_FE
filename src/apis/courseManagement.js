import axiosInstance from './axiosInstance';

export const CourseManagementAPI = {
  getAllCoursesManager: async (status) => {
    try {
      const url = `/CourseManagement/allCourses/Manager${status ? `?status=${status}` : ''}`;
      const { data } = await axiosInstance.get(url);
      return data;
    } catch (error) {
      throw error;
    }
  },
  createCourse: async (courseData) => {
    try {
      const { data } = await axiosInstance.post('/CourseManagement', courseData);
      return data;
    } catch (error) {
      throw error;
    }
  },
  approveCourse: async (courseId) => {
    try {
      const { data } = await axiosInstance.put(`/CourseManagement/approve/${courseId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId, courseData) => {
    try {
      const { data } = await axiosInstance.put(`/CourseManagement/${courseId}`, courseData);
      return data;
    } catch (error) {
      throw error;
    }
  },
  deactivateCourse: async (courseId) => {
    try {
      const { data } = await axiosInstance.delete(`/CourseManagement/${courseId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  getDraftCourses: async () => {
    try {
      const { data } = await axiosInstance.get('/CourseManagement/draft');
      return data;
    } catch (error) {
      throw error;
    }
  },
};
