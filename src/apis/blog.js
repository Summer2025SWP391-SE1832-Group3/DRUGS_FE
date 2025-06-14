import axios from "axios"

const apiBase = "https://localhost:7045/api"
export default apiBase;

export const BlogAPI = {
    getAll: async () => {
        try {
            const response = await axios.get(`${apiBase}/Blog`);
            return response.data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${apiBase}/Blog/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog with id ${id}:`, error);
            throw error;
        }
    }
}