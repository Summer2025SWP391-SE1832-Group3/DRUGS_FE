import axiosInstance from "./axiosInstance";
import apiBase from "./apiBase";

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

export const SurveyAPI = {
    createSurvey: async (values, courseId) => {
        try {
            const url = courseId
                ? `${apiBase}/Survey/create-survey?courseId=${courseId}`
                : `${apiBase}/Survey/create-survey`;
            const { data } = await axiosInstance.post(url, values);
            return data;
        } catch (error) {
            handleError(error, "Error creating survey:");
        }
    },
    getAllSurvey: async () => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Survey/all_survey`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching surveys:");
        }
    },
    updateSurvey: async (id, values) => {
        try {
            const { data } = await axiosInstance.put(`${apiBase}/Survey/${id}`, values);
            return data;
        } catch (error) {
            handleError(error, "Error updating survey:");
        }
    },
    updateStatus: async (id, isActive) => {
        try {
            const { data } = await axiosInstance.put(`${apiBase}/Survey/${id}/Status?isActive=${isActive}`);
            return data;
        } catch (error) {
            handleError(error, "Error updating survey status:");
        }
    },
    getSurveyById: async (id) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Survey/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching survey:");
        }
    },
    submitSurvey: async (id, answers) => {
        try {
            const { data } = await axiosInstance.post(`${apiBase}/Survey/submit/${id}`, { answers });
            return data;
        } catch (error) {
            handleError(error, "Error submitting survey:");
        }
    },
    getSurveyResult: async (id, userId) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Survey/${id}/surveyResult?userId=${userId}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching survey result:");
        }
    },
    surveyType: async (surveyType) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Survey/surveys/surveyType?surveyType=${surveyType}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching surveys by surveyType");
        }
    },
    userAddictionSurvey: async (userId) => {
        try {
            const { data } = await axiosInstance.get(`${apiBase}/Survey/user/${userId}/addiction-surveys`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching surveys by userId");
        }
    }
};