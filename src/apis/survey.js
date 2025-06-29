import axios from "axios";
import apiBase from "./apiBase";

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

export const SurveyAPI = {
    createSurvey: async (values) => {
        try {
            const { data } = await axios.post(`${apiBase}/Survey/create-survey`, values);
            return data;
        } catch (error) {
            handleError(error, "Error creating survey:");
        }
    },
    getAllSurvey: async () => {
        try {
            const { data } = await axios.get(`${apiBase}/Survey/all_survey`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching surveys:");
        }
    },
    deleteSurvey: async (id) => {
        try {
            const { data } = await axios.delete(`${apiBase}/Survey/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error deleting survey:");
        }
    },
    getSurveyById: async (id) => {
        try {
            const { data } = await axios.get(`${apiBase}/Survey/${id}`);
            return data;
        } catch (error) {
            handleError(error, "Error fetching survey:");
        }
    },
    submitSurvey: async (id, answers) => {
        try {
            const { data } = await axios.post(`${apiBase}/Survey/submit/${id}`, { answers });
            return data;
        } catch (error) {
            handleError(error, "Error submitting survey:");
        }
    }
};