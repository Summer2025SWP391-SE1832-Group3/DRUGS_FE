import axiosInstance from './axiosInstance';

export const CommentAPI = {
  postComment: async (content, blogId) => {
    try {
      const { data } = await axiosInstance.post('/Comment', { content, blogId });
      return data;
    } catch (error) {
      throw error;
    }
  },
  getCommentsByBlogId: async (blogId) => {
    try {
      const { data } = await axiosInstance.get(`/Comment/blog/${blogId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
  updateComment: async (commentId, content) => {
    try {
      const { data } = await axiosInstance.put('/Comment', { commentId, content });
      return data;
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async (commentId) => {
    try {
      const { data } = await axiosInstance.delete(`/Comment/${commentId}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
