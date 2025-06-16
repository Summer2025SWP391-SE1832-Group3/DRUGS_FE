import axios from "axios"

const apiBase = "https://localhost:7045/api"
export default apiBase;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: apiBase
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const BlogAPI = {
    getAll: async () => {
        try {
            const response = await axiosInstance.get('/Blog/approvedBlogs');
            return response.data;
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw error;
        }
    },
    getById: async (blogId) => {
        try {
            const response = await axiosInstance.get(`/Blog/${blogId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog with id ${blogId}:`, error);
            throw error;
        }
    },
    getByUserId: async (userId) => {
        try {
            const response = await axiosInstance.get(`/Blog/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blogs for user ${userId}:`, error);
            throw error;
        }
    }
}