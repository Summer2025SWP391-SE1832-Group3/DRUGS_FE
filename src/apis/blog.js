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
    getApprovedBlogs: async () => {
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
    },
    createBlog: async (blogData) => {
        try {
            const formData = new FormData();
            formData.append('title', blogData.title);
            formData.append('content', blogData.content);
            formData.append('category', blogData.category);
            
            // Handle single image upload
            if (blogData.blogImages && blogData.blogImages.length > 0) {
                // Log the image file for debugging
                console.log('Uploading image:', blogData.blogImages[0]);
                // Use 'blogImages' as the field name to match the API
                formData.append('blogImages', blogData.blogImages[0]);
            }

            // Log all FormData entries for debugging
            for (let pair of formData.entries()) {
                console.log('FormData entry:', pair[0], pair[1]);
            }

            const response = await axiosInstance.post('/Blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                transformRequest: [(data) => data], // Prevent axios from transforming the FormData
            });

            // Log the response for debugging
            console.log('Blog creation response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error("Error creating blog:", error);
            throw error;
        }
    }
}