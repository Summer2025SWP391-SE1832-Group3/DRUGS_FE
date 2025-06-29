import axios from "axios"
import apiBase from "./apiBase"

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

export const AccountAPI =  {
    register: async (value) => {
        try {
            const { data } = await axios.post(`${apiBase}/Account/register`, value);
            return data;
        } catch (error) {
            handleError(error, "Error registering:");
        }
    },

    login: async (value) => {
        try {
            const { data } = await axios.post(`${apiBase}/Account/login`, value);
            return data;
        } catch (error) {
            handleError(error, "Error logging in:");
        }
    } 
}