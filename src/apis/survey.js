import axios from "axios";
import apiBase from "./apiBase";

export const SurveyAPI = {
    createSurvey: async (value) => {
        try{
            const response = await axios.post(`${apiBase}/Survey/create-survey`, value);
            return response.data;
        }catch (error) {
            console.error("Error creating survey:", error);
            throw error;
        }
    },
    getAllSurvey: async () => {
        try{
            const response = await axios.get(`${apiBase}/Survey/all_survey`);
            return response.data;
        }catch (error) {
            console.error("Error fetching surveys:", error);
            throw error;
        }
    },
    deleteSurvey: async (id) => {
        try{
            const response = await axios.delete(`${apiBase}/Survey/${id}`);
            return response.data;
        }catch (error) {
            console.error("Error deleting survey:", error);
            throw error;
        }
    },
    getSurveyById: async (id) => {
        try {
            const response = await axios.get(`${apiBase}/Survey/${id}`);
            return response.data;
        }catch (error) {
            console.error("Error fetching survey:", error);
            throw error;
        }
    }
}