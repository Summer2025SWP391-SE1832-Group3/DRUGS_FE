import axiosInstance from "./axiosInstance";
import apiBase from "./apiBase";

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

export const CourseAPI = {
    createCourse: async (values) => {
        try {
            const { data } = await axiosInstance.post(`${apiBase}/Course`, values);
            return data;
        } catch (error) {
            handleError(error, "Error creating course:");
        }
    },
    getAllCourses: async () => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/all`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching courses:");
        }
    },
    getCourseById: async (id) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching course:");
        }
    },
    updateCourse: async (id, values) => {
        try {
            const { data } = await axiosInstance.put(`${apiBase}/Course/${id}`, values);
            return data;
        } catch (error) {
            handleError(error, "Error updating course:");
        }
    },
    deleteCourse: async (id) => {
        try {
            const { data } = await axiosInstance.delete(`${apiBase}/Course/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error deleting course:");
        }
    }
};