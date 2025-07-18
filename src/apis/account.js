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
    },

    getAccountById: async (userId, token) => {
        try {
            const { data } = await axios.get(`${apiBase}/Account/account/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            handleError(error, "Error fetching account by id:");
        }
    },

    updateProfile: async (profileData, token) => {
        try {
            const { data } = await axios.put(`${apiBase}/Account/profile`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            handleError(error, "Error updating profile:");
        }
    },

    changePassword: async (passwordData, token) => {
        try {
            const { data } = await axios.post(`${apiBase}/Account/change-password`, passwordData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return data;
        } catch (error) {
            handleError(error, "Error changing password:");
        }
    }
}