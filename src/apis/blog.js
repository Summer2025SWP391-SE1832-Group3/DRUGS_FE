import axios from "axios"
import apiBase from "./apiBase"

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: apiBase
});

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const handleError = (error, msg) => {
    console.error(msg, error);
    throw error;
};

const buildBlogFormData = (blogData) => {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('category', blogData.category);
    if (blogData.blogImages && blogData.blogImages.length > 0) {
        formData.append('images', blogData.blogImages[0]?.originFileObj || blogData.blogImages[0]);
    }
    return formData;
};

export const BlogAPI = {
    getApprovedBlogs: async () => {
        try {
            const { data } = await axiosInstance.get('/Blog/approvedBlogs');
            return data;
        } catch (error) {
            handleError(error, "Error fetching blogs:");
        }
    },
    getById: async (id) => {
        try {
            const { data } = await axiosInstance.get(`/Blog/${id}`);
            return data;
        } catch (error) {
            handleError(error, `Error fetching blog with id ${id}:`);
        }
    },
    getByUserId: async (userId) => {
        try {
            const { data } = await axiosInstance.get(`/Blog/${userId}`);
            return data;
        } catch (error) {
            handleError(error, `Error fetching blogs for user ${userId}:`);
        }
    },
    createBlog: async (blogData) => {
        try {
            const formData = buildBlogFormData(blogData);
            const { data } = await axiosInstance.post('/Blog', formData, {
                headers: { 'Accept': 'application/json' },
                transformRequest: [(data) => data],
            });
            return data;
        } catch (error) {
            handleError(error, "Error creating blog:");
        }
    },
    deleteBlog: async (id) => {
        try {
            const { data } = await axiosInstance.delete(`/Blog/${id}`);
            return data;
        } catch (error) {
            handleError(error, `Error deleting blog with id ${id}:`);
        }
    },
    updateBlog: async (id, blogData) => {
        try {
            const formData = buildBlogFormData(blogData);
            const { data } = await axiosInstance.put(`/Blog/${id}`, formData, {
                headers: { 'Accept': 'application/json' },
                transformRequest: [(data) => data],
            });
            return data;
        } catch (error) {
            handleError(error, `Error updating blog with id ${id}:`);
        }
    },
}