import axiosInstance from "./axiosInstance";
import apiBase from "./apiBase";

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

export const LessonAPI = {
    getLessonsByCourseId: async (courseId) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Lesson/course/${courseId}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching lessons by courseId:");
        }
    },
    createLesson: async ({ title, content, video, courseId }) => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (video) formData.append('video', video);
            formData.append('courseId', courseId);
            const { data } = await axiosInstance.post(`${apiBase}/Lesson`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (error) {
            handleError(error, "Error creating lesson:");
        }
    },
    updateLesson: async (lessonId, { title, content, video }) => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (video) formData.append('video', video);
            const { data } = await axiosInstance.put(`${apiBase}/Lesson/${lessonId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        } catch (error) {
            handleError(error, "Error updating lesson:");
        }
    },
    deleteLesson: async (lessonId) => {
        try {
            const { data } = await axiosInstance.delete(`${apiBase}/Lesson/${lessonId}`);
            return data;
        } catch (error) {
            handleError(error, "Error deleting lesson:");
        }
    }
};
