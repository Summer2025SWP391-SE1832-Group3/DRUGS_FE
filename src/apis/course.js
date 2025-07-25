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
            const { data } = await axiosInstance.get(`${apiBase}/Course/Detail/${id}`);
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
    },
    searchCourseByTitle: async (searchTerm) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/searchTitle`, {
                params: { searchTerm }
            });
            return data;
        } catch (error) {
            handleError(error, "Error searching course by title:");
        }
    },
    enrollCourse: async (id) => {
        try {
            const { data } = await axiosInstance.post(`${apiBase}/Course/enroll/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error enrolling course");
        }
    },
    memberCourses: async () => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/user/courses`);
            return data;
        } catch (error) {
            handleError(error, "Error fething member courses");
        }
    },
    getCourseProgress: async (courseId) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/progress/${courseId}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching course progress");
        }
    },
    updateLessonProgress: async (lessonId, isCompleted) => {
        try {
            const { data } = await axiosInstance.put(`${apiBase}/Course/progress/${lessonId}?isCompleted=${isCompleted}`);
            return data;
        } catch (error) {
            handleError(error, "Error updating lesson progress");
        }
    },
    filterByTopic: async (topic) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/topic/${topic}`);
            return data;
        } catch (error) {
            handleError(error, "Error filtering course by topic");
        }
    },
    coursesWithoutSurvey: async () => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/courses_without_survey`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching courses without survey");
        }
    },
    completedCourse: async (id) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Course/completed-course/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching completed course");
        }
    }
};
