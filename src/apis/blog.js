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
        console.log('User from localStorage in interceptor:', user);
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
            console.log('Authorization header set:', config.headers.Authorization);
        } else {
            console.log('No user token found');
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
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/Blog/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching blog with id ${id}:`, error);
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