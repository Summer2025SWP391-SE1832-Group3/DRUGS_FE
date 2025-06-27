import axios from "axios"
import apiBase from "./apiBase"

export const AccountAPI =  {
    register: async (value) => {
        try {
            const response = await axios.post(`${apiBase}/Account/register`, value);
            return response.data;
        } catch (error) {
            console.error("Error registering:", error);
            throw error;
        }
    },

    login: async (value) => {
        try {
            const response = await axios.post(`${apiBase}/Account/login`, value);
            return response.data;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    } 
}